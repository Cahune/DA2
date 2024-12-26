
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/pagination'; 
import 'swiper/css/navigation'; 
import { Navigation } from 'swiper/modules'; 
import LoadingSpinner from '../../../components/loading-spinner/LoadingSpinner';
import Navbar from '../../navbar/Navbar';
import CommentForm from '../../comment/commentForm/CommentForm';
import Map from '../../map/Map';
import WeatherForecast from '../../weather/Weather';
import Taxi from '../../taxi/Taxi';
import "./search.css";

const Search = () => {
  const { id } = useParams(); // Lấy ID từ URL path
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState(null); // Lưu trữ dữ liệu của địa điểm

  useEffect(() => {
    const fetchPlaceData = async () => {
      if (id) {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
          const response = await fetch(`http://localhost:7000/api/place/${id}`); // Lấy dữ liệu từ backend
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json(); // Chuyển đổi dữ liệu thành JSON
          setPlace(data); // Lưu dữ liệu địa điểm vào state
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu địa điểm:", err);
        } finally {
          setLoading(false); // Kết thúc tải dữ liệu
        }
      }
    };

    fetchPlaceData();
  }, [id]); // Chỉ phụ thuộc vào id

  console.log(place.geocode)

  const isVideo = (url) => {
    return url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.includes('youtube.com') || url.includes('youtu.be'));
  };

  return ( 
    <div className='search-bg'>
      <Navbar />
      <div>
        {loading && <LoadingSpinner />}
        <div className="search">
          <div className="search-container">
            {place ? (   
              <>
                <h1 className='title-place'>{place.name}</h1>
                <div className="place-details">
                  {place.images && place.images.length > 0 ? (
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      loop={true}
                      navigation={true} 
                      modules={[Navigation]} 
                      className="place-images-swiper"
                    >
                      {place.images.map((media, index) => (
                        <SwiperSlide key={index}>
                          {isVideo(media) ? (
                            <video controls className="place-media">
                              <source src={media} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img src={media} alt={`${place.name} image ${index + 1}`} className="place-image" />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <p>Không có hình ảnh hoặc video để hiển thị.</p>
                  )}
                </div>
                <div className='description'>
                  {place.subtitles.map((subtitle, idx) => (
                  <div key={idx} className="subtitle">
                    <h3>{subtitle.subtitle}</h3>
                    <p>{subtitle.description}</p>
                  </div>                 
                ))}
                </div>
                <Map />
                <Taxi placeId={id} />
                {place.geocode && <WeatherForecast geocode={place.geocode} />}
              </>
            ) : (
              <p>Không tìm thấy địa điểm nào.</p>
            )}
          </div>
        </div>
      </div>
      <CommentForm placeId={id} />
    </div>
  );
};

export default Search;
