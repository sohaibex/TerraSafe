import React, { PureComponent } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

import Chatbot from '../chatbot';

export default class Home extends PureComponent {
  state = {
    earthquakes: [],
    filterText: "",
    sortByMagnitude: false,
    currentPage: 1,
    itemsPerPage: 10,
    showModal: false,
    selectedEarthquake: null,
    earthquakeData: {},
    ingredientChecklist: ["Des tentes", "Cheeseburgers", "Insuline pour les Diabètes"],
    additionalNeeds: "",
    markers: {}
  };

  componentDidMount() {
    const map = L.map("map").setView([51.505, -0.09], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    this.fetchEarthquakeData(map);
  }

  fetchEarthquakeData = (map) => {
    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ earthquakes: data.features });
        this.addEarthquakeMarkers(data, map);
      })
      .catch((error) =>
        console.error("Error fetching earthquake data:", error)
      );
  };

  addEarthquakeMarkers = (data, map) => {
    const defaultIcon = L.icon({
      iconUrl: markerIconPng,
      shadowUrl: markerIconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const hoverIcon = L.icon({
      iconUrl: "/images/marker-icon-red.png",
    });

    const markers = {};
    let bounds = L.latLngBounds();

    data.features.forEach((feature, index) => {
      const { coordinates } = feature.geometry;
      const { mag, place } = feature.properties;

      const popupContent = `
        <strong>Magnitude:</strong> ${mag}<br>
        <strong>Location:</strong> ${place}<br>
        <form id="form-${index}">
          <div class="ingredients-list">
            <strong>Ingrédients nécessaires :</strong><br>
            ${this.state.ingredientChecklist.map(
              (item) => `
                <div class="ingredient-item">
                  <input type="checkbox" id="check-${item}-${index}" name="ingredient" value="${item}" />
                  <label for="check-${item}-${index}" id="label-${item}-${index}">${item}</label><br>
                </div>
              `
            ).join('')}
          </div>
          <div class="additional-needs">
            <strong>Additional Needs:</strong><br>
            <input type="text" id="additional-${index}" name="additionalNeeds" /><br>
          </div>
          <button type="submit">Submit</button>
        </form>
      `;

      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: defaultIcon,
      })
        .addTo(map)
        .bindPopup(popupContent);

      markers[index] = { marker, defaultIcon, hoverIcon };

      bounds.extend(marker.getLatLng());
    });

    if (data.features.length > 0) {
      map.fitBounds(bounds);
    }

    this.setState({ markers });

    // Attach event listeners after popups have been added to the DOM
    setTimeout(() => {
      data.features.forEach((feature, index) => {
        this.attachIngredientChangeHandlers(index);
      });
    }, 0);
  };

  attachIngredientChangeHandlers = (index) => {
    const form = document.getElementById(`form-${index}`);
    if (form) {
      this.state.ingredientChecklist.forEach((item) => {
        const checkbox = document.getElementById(`check-${item}-${index}`);
        if (checkbox) {
          checkbox.addEventListener('change', (event) => this.handleIngredientChange(event, index, item));
        }
      });
    }
  };

  handleIngredientChange = (event, index, item) => {
    const label = document.getElementById(`label-${item}-${index}`);
    if (label) {
      label.style.textDecoration = event.target.checked ? 'line-through' : 'none';
    }
  };

  handleSubmit = (event, index) => {
    event.preventDefault();
    const form = document.getElementById(`form-${index}`);
    const ingredients = Array.from(form.querySelectorAll('input[name="ingredient"]:checked')).map(el => el.value);
    const additionalNeeds = form.querySelector(`#additional-${index}`).value;
    console.log(`Ingredients for marker ${index}:`, ingredients);
    console.log(`Additional needs for marker ${index}:`, additionalNeeds);
    // Add code to save this data to the database
  };

  handleFilterChange = (e) => {
    this.setState({ filterText: e.target.value });
  };

  toggleSortByMagnitude = () => {
    this.setState((prevState) => ({
      sortByMagnitude: !prevState.sortByMagnitude,
    }));
  };

  filterAndSortEarthquakes = () => {
    const {
      earthquakes,
      filterText,
      sortByMagnitude,
      currentPage,
      itemsPerPage,
    } = this.state;
    const filtered = earthquakes
      .filter((earthquake) =>
        earthquake.properties.place
          .toLowerCase()
          .includes(filterText.toLowerCase())
      )
      .sort((a, b) =>
        sortByMagnitude
          ? b.properties.mag - a.properties.mag
          : a.properties.mag - b.properties.mag
      );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  renderEarthquakeData = () => {
    const filteredEarthquakes = this.filterAndSortEarthquakes();

    return filteredEarthquakes.map((earthquake, index) => {
      const { mag, place, time } = earthquake.properties;
      const date = new Date(time).toLocaleString();

      return (
        <div
          key={index}
          className="earthquake-detail"
          onMouseEnter={() => this.handleMarkerHover(index, true)}
          onMouseLeave={() => this.handleMarkerHover(index, false)}
        >
          <div className="magnitude">Magnitude: {mag}</div>
          <div className="location">{place}</div>
          <div className="time">{date}</div>
        </div>
      );
    });
  };

  renderPagination = () => {
    const { earthquakes, itemsPerPage, currentPage } = this.state;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(earthquakes.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => this.handlePageChange(number)}
            className={`page-button ${currentPage === number ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  handleMarkerHover = (index, isHovered) => {
    const { markers } = this.state;
    if (markers[index]) {
      markers[index].marker.setIcon(
        isHovered ? markers[index].hoverIcon : markers[index].defaultIcon
      );
    }
  };

  render() {
    const { showChatbot } = this.state;

    return (
      <div className="home">
        <div className="home-container">
          <div
            className="home-container-left"
            style={{ overflowY: "auto", maxHeight: "100vh", padding: "20px" }}
          >
            <h1>TerraSafe</h1>

            <input
              type="text"
              placeholder="Filter by city or country"
              value={this.state.filterText}
              onChange={this.handleFilterChange}
              style={{ marginBottom: "20px", width: "100%" }}
            />
            <button
              onClick={this.toggleSortByMagnitude}
              className="sort-button"
            >
              {this.state.sortByMagnitude
                ? "Sort by Smallest Magnitude"
                : "Sort by Largest Magnitude"}
            </button>
            <div style={{ marginTop: "20px" }}>
              {this.renderEarthquakeData()}
              {this.renderPagination()}
            </div>
          </div>
          <div className="home-container-right">
            <div id="map" style={{ height: "100vh" }}></div>
            <div
              className="chatbot-toggle-btn"
              onClick={() => this.setState({ showChatbot: !showChatbot })}
            >
              <i className="fa-solid fa-robot"></i>
            </div>
            {showChatbot && (
              <div className="chatbot-overlay">
                <Chatbot />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
