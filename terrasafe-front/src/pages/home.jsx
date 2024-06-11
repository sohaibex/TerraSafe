import React, { PureComponent } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import Chatbot from "../chatbot";
import PopupContent from "../components/PopupContent";

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
    ingredientChecklist: [],
    additionalNeeds: "",
    markers: {},
    hasHelpRequestData: {},
    helpRequests: {}, // Add a state property to store help-request data
  };

  // Inside the Home component
  closePopup = () => {
    const { markers } = this.state;
    // Loop through all markers and close their popups
    Object.values(markers).forEach(({ marker }) => {
      marker.closePopup();
    });
  };

  componentDidMount() {
    const map = L.map("map").setView([51.505, -0.09], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    this.fetchEarthquakeData(map);
  }

  fetchEarthquakeData = (map) => {
    fetch("https://nestjs-app-gvqz5uatza-od.a.run.app/earthquakes")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ earthquakes: data });
        this.addEarthquakeMarkers(data, map);
      })
      .catch((error) =>
        console.error("Error fetching earthquake data:", error)
      );
  };

  fetchHelpRequestData = (id) => {
    return fetch(`https://nestjs-app-gvqz5uatza-od.a.run.app/earthquakes/${id}/help-request`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        this.setState((prevState) => ({
          helpRequests: { ...prevState.helpRequests, [id]: data },
          hasHelpRequestData: { ...prevState.hasHelpRequestData, [id]: true }, // Update state
        }));
        return data;
      })
      .catch((error) => {
        console.error("Error fetching help-request data:", error);
        this.setState((prevState) => ({
          hasHelpRequestData: { ...prevState.hasHelpRequestData, [id]: false }, // Update state
        }));
        return null;
      });
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

    data.forEach((feature) => {
      const { _latitude, _longitude } = feature.coordinates;
      const id = feature.code;

      const marker = L.marker([_latitude, _longitude], {
        icon: defaultIcon,
      }).addTo(map);

      marker.on("mouseover", () => {
        this.fetchHelpRequestData(id).then((helpRequestData) => {
          const popupContainer = document.createElement("div");
          const root = createRoot(popupContainer);
          root.render(
            <PopupContent
              feature={feature}
              index={id}
              ingredientChecklist={this.state.ingredientChecklist}
              onSubmit={this.handleSubmit}
              onClosePopup={this.closePopup} // Pass closePopup as a prop
              helpRequestData={helpRequestData}
              authoritiesContacts={helpRequestData ? helpRequestData.authoritiesContacts : ""}
            />
          );
          marker.bindPopup(popupContainer).openPopup();
        });
      });

      markers[id] = { marker, defaultIcon, hoverIcon };
      bounds.extend(marker.getLatLng());
    });

    if (data.length > 0) {
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

  handleSubmit = (formState, id) => {
    return new Promise((resolve, reject) => {
      const { ingredients, additionalNeeds, authoritiesContacts, images } = formState;
      const stuffNeededToHelp = {
        ...ingredients,
        [additionalNeeds]: false,
      };
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          const helpRequest = {
            stuffNeeded: stuffNeededToHelp,
          };
  
          const currentLocation = {
            latitude,
            longitude,
          };
  
          const formData = new FormData();
          const method = this.state.hasHelpRequestData[id] ? "PUT" : "POST"; // Determine method based on state
  
          if (method === "POST") {
            formData.append("helpRequest", JSON.stringify(helpRequest));
            formData.append("authoritiesContacts", JSON.stringify(authoritiesContacts));
            formData.append("currentLocation", JSON.stringify(currentLocation));
            images.forEach((image) => {
              formData.append("file", image); // Append file for POST request
            });
          } else if (method === "PUT") {
            formData.append("updateData", JSON.stringify(helpRequest));
            images.forEach((image) => {
              formData.append("file", image); // Append file for PUT request
            });
          }
  
          fetch(`https://nestjs-app-gvqz5uatza-od.a.run.app/earthquakes/${id}/help-request`, {
            method,
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
              resolve(); // Resolve the promise on success
            })
            .catch((error) => {
              console.error("Error:", error);
              reject(error); // Reject the promise on error
            });
        },
        (error) => {
          console.error("Error getting current location:", error);
          reject(error); // Reject the promise on error
        }
      );
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
        earthquake.location.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) =>
        sortByMagnitude ? b.magnitude - a.magnitude : a.magnitude - b.magnitude
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
      const { magnitude, location, timestamp, code } = earthquake;
      const date = new Date(timestamp._seconds * 1000).toLocaleString();

      return (
        <div
          key={code} // Use code as the key
          className="earthquake-detail"
          onMouseEnter={() => this.handleMarkerHover(code, true)} // Use code for hover
          onMouseLeave={() => this.handleMarkerHover(code, false)} // Use code for hover
        >
          <div className="magnitude">Magnitude: {magnitude}</div>
          <div className="location">{location}</div>
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

  handleMarkerHover = (id, isHovered) => {
    const { markers } = this.state;
    if (markers[id]) {
      markers[id].marker.setIcon(
        isHovered ? markers[id].hoverIcon : markers[id].defaultIcon
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
            <button onClick={this.toggleSortByMagnitude} className="sort-button">
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