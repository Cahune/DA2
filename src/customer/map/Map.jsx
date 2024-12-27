import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeadlessTippy from "@tippyjs/react/headless";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, divIcon, point } from "leaflet";
import "./map.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import Fuse from "fuse.js";
import SuggestItem from "../header/SuggestItem";

const Map = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState(null); // Lưu trữ dữ liệu địa điểm
  const [geocodes, setGeocodes] = useState([]); // Danh sách geocode

  // Gợi ý tìm kiếm
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromResult, setShowFromResult] = useState(false);
  const [showToResult, setShowToResult] = useState(false);

  const [fromLocation, setFromLocation] = useState({ geocode: null, airportGeocode: null });
  const [toLocation, setToLocation] = useState({ geocode: null, airportGeocode: null });
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [vehicleType, setVehicleType] = useState("driving-car");
  
  const [routeDistance, setRouteDistance] = useState(0); // Quãng đường
  const [routeDuration, setRouteDuration] = useState(0); // Thời gian

  const dotenv = require('dotenv');
  dotenv.config({path: '../../../.env'});
  const MAP_API_KEY = process.env.MAP_API_KEY;
  console.log("MAP_API_KEY:", MAP_API_KEY);

  const FUSE_OPTIONS = {
    shouldSort: true,
    threshold: 0.5,
    isCaseSensitive: false,
    keys: ["name"],
  };

  const airplaneIcon = new Icon({
    iconUrl: require("../../images/airplane.png"),  // Đảm bảo có hình ảnh máy bay
    iconSize: [38, 38], // Kích thước của icon
  });
  
  const defaultIcon = new Icon({
    iconUrl: require("../../images/mark.png"),
    iconSize: [38, 38], // Kích thước của icon
  });  

  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  // Fetch dữ liệu địa điểm từ API
  useEffect(() => {
    const fetchPlaceData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await fetch(`https://da2-ghy9.onrender.com/api/place/${id}`);
          if (!response.ok) {
            throw new Error(`Lỗi HTTP! status: ${response.status}`);
          }
  
          const data = await response.json(); // Kết quả từ API
          setPlace(data); // Lưu toàn bộ dữ liệu địa điểm
  
          if (data.name) {
            setToInput(data.name); // Cập nhật tên cho điểm đến
          }
  
          // Cập nhật geocode của điểm đến
          if (data.geocode && Array.isArray(data.geocode) && data.geocode.length === 2) {
            setGeocodes([data.geocode]);
            setToLocation((prev) => ({
              ...prev,
              geocode: data.geocode, // Lưu geocode vào trạng thái
            }));
          }
           else {
            console.error("Định dạng geocode không hợp lệ:", data.geocode);
            setGeocodes([]); // Không lưu nếu geocode không hợp lệ
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu địa điểm:", err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchPlaceData();
  }, [id]);
  
  // Hàm fetch suggestions
  // Hàm tìm kiếm gợi ý cho điểm đi
  const fetchSuggestions = async (input, setSuggestions, setLocationData) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://da2-ghy9.onrender.com/api/place/search-by-name?name=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      const fuse = new Fuse(data, FUSE_OPTIONS);
      const results = fuse.search(input);
  
      setSuggestions(results.map((result) => result.item));
  
      if (results.length > 0) {
        const selectedPlace = results[0].item; // Lấy gợi ý đầu tiên
        const geocode = selectedPlace.geocode;
        const airportGeocode = selectedPlace.airport?.airport_geocode || null;
  
        // Lưu cả thông tin geocode và airport_geocode vào trạng thái
        setLocationData({
          geocode,
          airportGeocode,
        });
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };  

  const fetchRoute = async (start, end, vehicleType = "driving-car") => {
    const apiKey = MAP_API_KEY; 
    const url = `https://api.openrouteservice.org/v2/directions/${vehicleType}?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.features && data.features[0].properties) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const distance = route.properties.summary.distance; // Khoảng cách (mét)
        const duration = route.properties.summary.duration; // Thời gian (giây)
  
        return { coordinates, distance, duration };
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
    return null;
  };
  

useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchSuggestions(fromInput, setFromSuggestions, setFromLocation);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [fromInput]);

useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchSuggestions(toInput, setToSuggestions, setToLocation);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [toInput]);

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180; // Chuyển đổi độ sang radian

  const R = 6371; // Bán kính Trái Đất (km)
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Khoảng cách (km)
};

const estimateFlightTime = (distance) => {
  const averageSpeed = 900; // Vận tốc trung bình của máy bay (km/h)
  const timeInHours = distance / averageSpeed;
  return timeInHours * 60; // Thời gian tính bằng phút
};

const handleClickSuggestion = (setInput, setShowResult, setGeocode) => (name, geocode, airportGeocode) => {
  setInput(name);
  setShowResult(false);
  if (airportGeocode && Array.isArray(airportGeocode) && airportGeocode.length === 2) {
    setGeocode(airportGeocode); // Cập nhật geocode sân bay nếu có
  } else if (geocode && Array.isArray(geocode) && geocode.length === 2) {
    setGeocode(geocode); // Nếu không có sân bay, dùng geocode thông thường
  }
};

const handleSearchRoute = async (vehicleType) => {
  if (vehicleType === "airplane") {
    if (fromLocation.airportGeocode && toLocation.airportGeocode) {
      const [fromCoords, toCoords] = [fromLocation.airportGeocode, toLocation.airportGeocode];
      const distance = haversineDistance(fromCoords, toCoords);
      const duration = estimateFlightTime(distance);

      setRouteCoordinates([fromCoords, toCoords]); // Vẽ đường thẳng giữa 2 sân bay
      setRouteDistance(distance * 1000); // Quãng đường (mét)
      setRouteDuration(duration * 60); // Thời gian (giây)
    } else {
      console.error("Cả hai điểm phải có geocode sân bay để sử dụng phương tiện máy bay.");
    }
    return;
  }

  // Xử lý các phương tiện khác
  if (fromLocation.geocode && toLocation.geocode) {
    const result = await fetchRoute(fromLocation.geocode, toLocation.geocode, vehicleType);
    if (result) {
      setRouteCoordinates(result.coordinates);
      setRouteDistance(result.distance);
      setRouteDuration(result.duration);
    } else {
      console.error("Không thể tìm thấy tuyến đường.");
    }
  }
};

  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!place) {
    return <p>Place not found</p>;
  }

  return (
    <div className="map-container">
      <div className="map-infor">
        <div className="form-group">
          <label>Điểm Đi:</label>
          <HeadlessTippy
            placement="bottom"
            interactive
            visible={showFromResult && fromSuggestions.length > 0}
            render={(attrs) => (
              <div className="search-result" tabIndex="-1" {...attrs}>
                {fromSuggestions.map((suggestion, index) => (
                  <SuggestItem
                    key={index}
                    searchSuggestion={suggestion}
                    handleClickSuggestion={handleClickSuggestion(setFromInput, setShowFromResult)}
                  />
                ))}
              </div>
            )}
            onClickOutside={() => setShowFromResult(false)}
          >
            <input
              type="text"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              onFocus={() => setShowFromResult(true)}
              placeholder="Nhập điểm xuất phát"
              className="input"
            />
          </HeadlessTippy>
        </div>

        <div className="switch-container">
          <button
            className="switch-button"
            onClick={() => {
              const temp = fromInput;
              setFromInput(toInput);
              setToInput(temp);
            }}
          >
            <FontAwesomeIcon icon={faExchangeAlt} size="lg" />
          </button>
        </div>

        <div className="form-group">
          <label>Điểm Đến:</label>
          <HeadlessTippy
            placement="bottom"
            interactive
            visible={showToResult && toSuggestions.length > 0}
            render={(attrs) => (
              <div className="search-result" tabIndex="-1" {...attrs}>
                {toSuggestions.map((suggestion, index) => (
                  <SuggestItem
                    key={index}
                    searchSuggestion={suggestion}
                    handleClickSuggestion={handleClickSuggestion(setToInput, setShowToResult)}
                  />
                ))}
              </div>
            )}
            onClickOutside={() => setShowToResult(false)}
          >
            <input
              type="text"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              onFocus={() => setShowToResult(true)}
              placeholder="Nhập điểm đến"
              className="input"
            />
          </HeadlessTippy>
        </div>

        <div className="button-container">
          <label htmlFor="vehicle-type">Chọn phương tiện:</label>
          <select
            id="vehicle-type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="driving-car">Xe hơi</option>
            <option value="cycling-regular">Xe đạp</option>
            <option value="foot-walking">Đi bộ</option>
            <option value="airplane">Máy bay</option>
          </select>
          <button className="search-button" onClick={() => handleSearchRoute(vehicleType)}>
            Tìm Đường
          </button>
        </div>

        <div className="route-info-parent">
          <div className="route-info">
            {routeDistance > 0 && routeDuration > 0 && (
              <p>
                Quãng đường: {(routeDistance / 1000).toFixed(2)} km<br />
                <br />
                Thời gian dự kiến: {(routeDuration / 3600).toFixed(0)} giờ {(routeDuration % 60).toFixed(0)} phút
              </p>
            )}
          </div>
        </div>

      </div>
      <MapContainer center={[21.126, 105.776]} zoom={13} className="map-detail">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
           {/* Marker cho điểm xuất phát */}
          {fromLocation.airportGeocode && vehicleType === "airplane" ? (
            <Marker position={fromLocation.airportGeocode} icon={airplaneIcon}>
              <Popup>Điểm xuất phát: {fromInput}</Popup>
            </Marker>
          ) : (
            fromLocation.geocode && (
              <Marker position={fromLocation.geocode} icon={defaultIcon}>
                <Popup>Điểm xuất phát: {fromInput}</Popup>
              </Marker>
            )
          )}

          {/* Marker cho điểm đến */}
          {toLocation.airportGeocode && vehicleType === "airplane" ? (
            <Marker position={toLocation.airportGeocode} icon={airplaneIcon}>
              <Popup>Điểm đến: {toInput}</Popup>
            </Marker>
          ) : (
            toLocation.geocode && (
              <Marker position={toLocation.geocode} icon={defaultIcon}>
                <Popup>Điểm đến: {toInput}</Popup>
              </Marker>
            )
          )}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" />
        )}

        </MarkerClusterGroup>
      </MapContainer>

    </div>
  );
};

export default Map;
