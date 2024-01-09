import React, { PureComponent } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class Home extends PureComponent {
  componentDidMount() {
    // Create a map instance and specify the container ID
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add the tile layer - replace the URL with the desired tile source
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }

  render() {
    return (
      <div className='home'>
        <div className='home-container'>
          <div className='home-container-left'>
            <h1>TerraSafe</h1>
            <p>Home Page</p>
          </div>
          <div className='home-container-right'>
            <div id='map' style={{ height: '100vh' }}></div>
          </div>  
        </div>  
      </div>
    );
  }
}