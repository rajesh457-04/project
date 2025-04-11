import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FreeMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapInstance.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);
    return () => {
      if (mapInstance.current) mapInstance.current.remove();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setError('Location not found');
        return;
      }

      const firstResult = data[0];
      const { lat, lon, display_name } = firstResult;
      const newLocation = [parseFloat(lat), parseFloat(lon)];

      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }

      markerRef.current = L.marker(newLocation)
        .addTo(mapInstance.current)
        .bindPopup(`<b>${searchQuery}</b><br>${display_name}`)
        .openPopup();

      mapInstance.current.setView(newLocation, 13);
      setError('');
    } catch (err) {
      setError('Failed to fetch location');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    }}>
      <h1 style={{ fontFamily: "'Georgia', serif" }}>Free Tour Map 🗺️</h1>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for places (e.g., Taj Mahal)"
          style={{ 
            flex: 1, 
            padding: '8px', 
            fontSize: '16px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          style={{ 
            padding: '8px 16px', 
            marginLeft: '8px', 
            cursor: 'pointer',
            backgroundColor: '#1e90ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background-color 0.3s'
          }}
        >
          Search
        </button>
      </div>
      {error && <p style={{ color: 'red', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>{error}</p>}
      <div 
        ref={mapRef} 
        style={{ height: '500px', width: '800px', border: '1px solid #ccc', borderRadius: '8px' }}
      />
      <div style={{ 
        marginTop: '10px', 
        fontSize: '14px', 
        color: '#666',
        fontFamily: "'Georgia', serif",
        fontStyle: 'italic'
      }}>
        <p>Zoom out. Breathe in. Let curiosity guide you.</p>
      </div>
    </div>
  );
};

export default FreeMap;
