import React, { useState, useEffect } from 'react';

const History = () => {
  const [earthquakeData, setEarthquakeData] = useState([]);

  useEffect(() => {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
      .then(response => response.json())
      .then(data => {
        setEarthquakeData(data.features);
      })
      .catch(error => {
        console.error('Error fetching earthquake data:', error);
      });
  }, []);

  return (
    <div>
      {earthquakeData.map(earthquake => (
        <div key={earthquake.id} className="earthquake">
          <h3>{earthquake.properties.title}</h3>
          <p><strong>Magnitude:</strong> {earthquake.properties.mag}</p>
          <p><strong>Location:</strong> {earthquake.properties.place}</p>
          <p><strong>Coordinates:</strong> {earthquake.geometry.coordinates[1]}, {earthquake.geometry.coordinates[0]}</p>
          <p><strong>Time:</strong> {new Date(earthquake.properties.time).toLocaleString()}</p>
          <p><a href={earthquake.properties.url} target="_blank" rel="noreferrer">More info</a></p>
        </div>
      ))}
    </div>
  );
};

export default History;
