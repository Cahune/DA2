const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const { Place } = require("../config/config"); // Đảm bảo rằng bạn đã định nghĩa model Place trong config

const app = express();
const port = 7000;
require('dotenv').config({path: '../../.env'});
const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI;

// Middleware để xử lý JSON và URL-encoded dữ liệu
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS to allow frontend apps to connect

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

// Endpoint để tìm kiếm trong collection 'place' theo tên
app.get('/api/place/search-by-name', async (req, res) => {
    const placeName = req.query.name; // Lấy tên từ query
    try {
        // Sử dụng Mongoose để tìm kiếm trong collection 'place' theo tên (không phân biệt chữ hoa chữ thường)
        const places = await Place.find({
            name: { $regex: placeName, $options: 'i' } // Biểu thức regex để tìm tên khớp một phần
        });

        res.json(places); // Trả về kết quả dạng JSON cho frontend
    } catch (err) {
        console.error('Error fetching places:', err);
        res.status(500).json({ error: 'Error fetching places' });
    }
});

// Lấy thông tin địa điểm theo ID
app.get('/api/place/:id', async (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số đường dẫn
    try {
        // Sử dụng Mongoose để tìm địa điểm theo ID
        const place = await Place.findById(id); // Tìm địa điểm theo ID

        if (!place) {
            return res.status(404).json({ message: 'Place not found' }); // Trả về thông báo nếu không tìm thấy
        }

        res.json(place); // Trả về địa điểm tìm thấy
    } catch (err) {
        console.error('Error fetching place by ID:', err);
        res.status(500).json({ error: 'Error fetching place by ID' });
    }
});

// Lắng nghe trên cổng 7000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });