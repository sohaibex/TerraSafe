import React, { PureComponent } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import Chatbot from "../chatbot";
import PopupContent from "../components/PopupContent";
import ReactDOM from "react-dom";

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
    ingredientChecklist: [
      "Des tentes",
      "Cheeseburgers",
      "Insuline pour les Diabètes",
    ],
    additionalNeeds: "",
    markers: {},
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

      const popupContainer = document.createElement("div");
      ReactDOM.render(
        <PopupContent
          feature={feature}
          index={index}
          ingredientChecklist={this.state.ingredientChecklist}
          onSubmit={this.handleSubmit}
        />,
        popupContainer
      );

      const marker = L.marker([coordinates[1], coordinates[0]], {
        icon: defaultIcon,
      })
        .addTo(map)
        .bindPopup(popupContainer);

      markers[index] = { marker, defaultIcon, hoverIcon };

      bounds.extend(marker.getLatLng());
    });

    if (data.features.length > 0) {
      map.fitBounds(bounds);
    }

    this.setState({ markers });
  };

  convertDecimalToDMS = (decimal) => {
    const degrees = Math.floor(decimal);
    const minutesDecimal = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    return `${degrees}° ${minutes}' ${seconds.toFixed(3)}''`;
  };

  handleSubmit = (formState, index, coordinates) => {
    const { ingredients, additionalNeeds, images } = formState;
    const stuffNeededToHelp = {
      ...ingredients,
      [additionalNeeds]: false, // Adding additionalNeeds as a key with false value
    };

    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const helpRequest = {
            stuffNeeded: stuffNeededToHelp,
            images: [], // images will be handled as files in the form data
            analysedImageDescription: "", // Add appropriate description if needed
        };

        const currentLocation = {
            latitude,
            longitude
        };

        const formData = new FormData();
        formData.append("helpRequest", JSON.stringify(helpRequest));
        formData.append("current_location", JSON.stringify(currentLocation));
        images.forEach((image, idx) => {
            formData.append(`file${idx}`, image);
        });

        fetch(`/api/earthquakes/${index}/help-request`, {
            method: "POST",
            body: formData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

        console.log("Form Data:", formData);
    }, error => {
        console.error("Error getting current location:", error);
        // Handle error getting location here
    });
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
