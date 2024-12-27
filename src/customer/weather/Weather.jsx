import React, { useState, useEffect } from "react";
import "./weather.css"

const WeatherForecast = ({ geocode }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dự báo thời tiết
  const fetchWeatherForecast = async (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // Thay bằng API Key của bạn
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Lỗi khi lấy dữ liệu thời tiết");
      }
      const data = await response.json();
      const dailyForecast = data.list.filter((entry, index) => index % 8 === 0); // Lọc dữ báo theo ngày
      setForecast(dailyForecast);
      setLoading(false);
    } catch (err) {
      setError("Không thể lấy dữ liệu dự báo thời tiết.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geocode && geocode.length === 2) {
      const [latitude, longitude] = geocode;
      fetchWeatherForecast(latitude, longitude);
    }
  }, [geocode]);

  if (loading) {
    return <p>Đang tải dữ liệu thời tiết...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="weather-info">
      <h2>Dự báo thời tiết trong 5 ngày tới:</h2>
      {forecast && forecast.length > 0 ? (
        <div>
          {forecast.map((entry, index) => (
            <div key={index} className="forecast-item">
              <h3>{new Date(entry.dt * 1000).toLocaleDateString()}</h3>
              <p>Nhiệt độ: {entry.main.temp}°C</p>
              <p>Mô tả: {entry.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                alt="icon thời tiết"
                class="weather-icon"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Không có dữ liệu dự báo thời tiết.</p>
      )}
    </div>
  );
};

export default WeatherForecast;
