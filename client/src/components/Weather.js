import React, { useState } from 'react';
import axios from 'axios';
import './weather.css'; 
const getLocalIcon = (condition) => {
  const lower = condition.toLowerCase();
  if (lower.includes("clear")) return "/images/clear.png";
  if (lower.includes("cloud")) return "/images/cloud.png";
  if (lower.includes("drizzle")) return "/images/drizzle.png";
  if (lower.includes("rain")) return "/images/rain.png";
  return "/images/humidity.png"; 
};

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const handleFetchWeather = async () => {
    if (!location) {
      setError('Please enter a location');
      return;
    }

    const apiKey = 'fc9612990001eda22e10d230e8b576f0';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      setWeather(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Unable to fetch weather data. Please try again.');
      setWeather(null);
    }
  };

  return (
    <div className="weather-container">
      <h2 className="title">☁️ Weather Updates</h2>
      <div className="search-box">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button onClick={handleFetchWeather}>Search</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {weather && (
        <div className="weather-card">
          <img
            src={getLocalIcon(weather.weather[0].main)}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <h3>{weather.name}</h3>
          <p className="desc">{weather.weather[0].description}</p>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

