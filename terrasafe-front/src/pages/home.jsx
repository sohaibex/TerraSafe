import React, { PureComponent } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

export default class Home extends PureComponent {
  state = {
    earthquakes: [],
    filterText: "",
    sortByMagnitude: false,
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
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
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

    data.features.forEach((feature) => {
      const { coordinates } = feature.geometry;
      const { mag, place } = feature.properties;

      L.marker([coordinates[1], coordinates[0]], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(
          `<strong>Magnitude:</strong> ${mag}<br><strong>Location:</strong> ${place}`
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
    const { earthquakes, filterText, sortByMagnitude } = this.state;

    return earthquakes
      .filter((earthquake) =>
        earthquake.properties.place
          .toLowerCase()
          .includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        if (sortByMagnitude) {
          return b.properties.mag - a.properties.mag;
        }
        return a.properties.mag - b.properties.mag;
      });
  };

  renderEarthquakeData = () => {
    const filteredEarthquakes = this.filterAndSortEarthquakes();

    return filteredEarthquakes.map((earthquake, index) => {
      const { mag, place, time } = earthquake.properties;
      const date = new Date(time).toLocaleString();

      return (
        <div key={index}>
          <p>
            <strong>Magnitude:</strong> {mag}
          </p>
          <p>
            <strong>Location:</strong> {place}
          </p>
          <p>
            <strong>Time:</strong> {date}
          </p>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="home">
        <div className="home-container">
          <div
            className="home-container-left"
            style={{ overflowY: "scroll", maxHeight: "100vh", padding: "10px" }}
          >
            <h1>TerraSafe</h1>
            <p>Home Page</p>
            <input
              type="text"
              placeholder="Filter by city or country"
              value={this.state.filterText}
              onChange={this.handleFilterChange}
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <button
              onClick={this.toggleSortByMagnitude}
              style={{ marginBottom: "20px" }}
            >
              {this.state.sortByMagnitude
                ? "Sort by Smallest Magnitude"
                : "Sort by Largest Magnitude"}
            </button>
            <div style={{ marginTop: "20px" }}>
              {this.renderEarthquakeData()}
            </div>
          </div>
          <div className="home-container-right">
            <div id="map" style={{ height: "100vh" }}></div>
          </div>
        </div>
      </div>
    );
  }
}
