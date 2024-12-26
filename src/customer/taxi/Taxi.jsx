import React, { useState, useEffect } from 'react';

const Taxi = ({ placeId }) => {
    const [taxis, setTaxis] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTaxis = async () => {
            if (!placeId) {
                console.error("Thiếu placeId");
                return;
            }

            console.log("Fetching taxis for placeId:", placeId);

            try {
                const response = await fetch(`http://localhost:8001/taxis/${placeId}`);
                if (!response.ok) {
                    throw new Error('k thấy');
                }
                const data = await response.json();
                setTaxis(data); // Cập nhật dữ liệu taxi
            } catch (err) {
                setError(err.message); // Cập nhật lỗi nếu có
            }
        };

        fetchTaxis(); // Gọi API
    }, [placeId]); // Chạy lại mỗi khi placeId thay đổi

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Danh sách Taxi cho địa điểm: {placeId}</h2>
            {taxis.length === 0 ? (
                <p>Không có taxi nào cho địa điểm này</p>
            ) : (
                <ul>
                    {taxis.map((taxi) => (
                        <li key={taxi._id}>
                            <p>Tên Taxi: {taxi.name}</p>
                            <p>Số điện thoại: {taxi.phoneNumber}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Taxi;
