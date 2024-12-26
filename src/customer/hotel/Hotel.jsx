import React, { useState, useEffect } from 'react';
import "./hotel.css";

const Hotel = ({ placeId }) => {
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            if (!placeId) {
                console.error("Thiếu placeId");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8002/hotels/${placeId}`);
                if (!response.ok) {
                    throw new Error('k thấy');
                }
                const data = await response.json();
                setHotels(data); 
            } catch (err) {
                setError(err.message); // Cập nhật lỗi nếu có
            }
        };

        fetchHotels(); // Gọi API
    }, [placeId]); // Chạy lại mỗi khi placeId thay đổi

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='hotel-list'>
            <h2>Danh sách khách sạn cho địa điểm</h2>
            {hotels.length === 0 ? (
                <p>Không có khách sạn nào cho địa điểm này</p>
            ) : (
                <ul>
                    {hotels.map((hotel) => (
                        <li key={hotel._id}>
                            <p>Tên khách sạn: {hotel.name}</p>
                            <p>Số điện thoại: {hotel.phoneNumber}</p>
                            <p>Địa chỉ: 
                                {hotel?.address && hotel.address.map((addr, idx) => (
                                    <p key={idx}>
                                    {addr}
                                    <br />
                                    </p>
                                ))}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Hotel;
