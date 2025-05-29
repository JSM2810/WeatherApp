import React, { useState, useEffect } from "react";
import WeatherChart from "./components/WeatherChart";
import "./App.css";

function App() {
  const [city, setCity] = useState("London");
  const [forecast, setForecast] = useState([]);
  const [weather, setWeather] = useState(null);
  const [input, setInput] = useState("");

  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherRes.json();
      if (weatherData.cod === 200) {
        setWeather(weatherData);
      } else {
        setWeather(null);
        console.error("Weather error:", weatherData.message);
      }
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setWeather(null);
    }

    try {
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastRes.json();
      if (forecastData.cod === "200" && Array.isArray(forecastData.list)) {
        const dailyData = forecastData.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData.slice(0, 5));
      } else {
        console.error("Forecast error:", forecastData.message);
        setForecast([]);
      }
    } catch (err) {
      console.error("Forecast fetch failed:", err);
      setForecast([]);
    }
  };

  useEffect(() => {
    fetchWeather(city); 
  }, 
  [city,apiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setCity(input.trim());
      setInput("");
    }
  };

  return (
    <div className="app-container">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {weather ? (
        <div className="weather-info">
          <h2>Current Weather in {weather.name}</h2>
          <p>Temperature: {weather.main?.temp ?? "N/A"}°C</p>
          <p>Condition: {weather.weather?.[0]?.description ?? "N/A"}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

      {forecast.length > 0 && <WeatherChart forecast={forecast} />}
    </div>
  );
}

export default App;
