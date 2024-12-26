const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import các route
const placeRoutes = require('./place');
const taxiRoutes = require('./taxis');
const commentRoutes = require('./comments');
const hotelRoutes = require('./hotels');
const authRoutes = require('./signup-login');

const app = express();

// Load biến môi trường từ file .env
dotenv.config({path: '../../.env'});

// Lấy thông tin kết nối MongoDB từ biến môi trường
const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Cấu hình CORS

// Kết nối với MongoDB
mongoose
  .connect(MONGODB_CONNECT_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((err) => {
    console.log('Database connection failed:', err);
  });

// Đăng ký các route
app.use('/api/place', placeRoutes);  // Các route cho "place"
app.use('/api/taxis', taxiRoutes);  // Các route cho "taxis"
app.use('/api/comments', commentRoutes);  // Các route cho "comments"
app.use('/api/hotels', hotelRoutes);  // Các route cho "hotels"
app.use('/api/auth', authRoutes);  // Các route cho "signup-login"

// Lắng nghe trên cổng Render cấp hoặc cổng mặc định
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
