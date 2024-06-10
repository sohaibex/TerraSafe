import React, { useState, useEffect } from 'react';

const History = () => {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetch('http://localhost:3000/earthquakes')
      .then(response => response.json())
      .then(data => {
        setEarthquakeData(data);
      })
      .catch(error => {
        console.error('Error fetching earthquake data:', error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = earthquakeData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='history-block'>
      <div className="history-container">
        <h1>Earthquake History</h1>
        <p>View a list of recent earthquakes that have occurred in the area.</p>
        {currentItems.map(earthquake => (
          <div key={earthquake.id} className="earthquake-card">
            <h3 className="earthquake-title">{earthquake.title}</h3>
            <p><strong>Magnitude:</strong> {earthquake.mag}</p>
            <p><strong>Location:</strong> {earthquake.location}</p>
            <p><strong>Coordinates:</strong> {earthquake.coordinates[1]}, {earthquake.coordinates[0]}</p>
            <p><strong>Time:</strong> {new Date(earthquake.time).toLocaleString()}</p>
            <p><a href={earthquake.url} target="_blank" rel="noreferrer">More info</a></p>
          </div>
        ))}
        <div className="pagination">
          {[...Array(Math.ceil(earthquakeData.length / itemsPerPage)).keys()].map(number => (
            <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>
              {number + 1}
            </button>
          ))}
        </div>
      </div>
      <div className='history-flex'>
        <img src='https://images.unsplash.com/photo-1626695840539-a8821cdbcd9b?q=80&w=2785&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='earthquake' />
      </div>
    </div>
    
  );
};

export default History;
