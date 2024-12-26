import React, { useState, useEffect } from "react";

const WeatherForecast = ({ geocode }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm lấy dự báo thời tiết
  const fetchWeatherForecast = async (latitude, longitude) => {
    const apiKey = "c65fe08a0e0c1be9689c8a561a78f476"; // Thay bằng API Key của bạn
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
      <h4>Dự báo thời tiết trong 5 ngày tới:</h4>
      {forecast && forecast.length > 0 ? (
        <div>
          {forecast.map((entry, index) => (
            <div key={index} className="forecast-item">
              <h5>{new Date(entry.dt * 1000).toLocaleDateString()}</h5>
              <p>Nhiệt độ: {entry.main.temp}°C</p>
              <p>Mô tả: {entry.weather[0].description}</p>
              <img
                src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}
                alt="icon thời tiết"
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
