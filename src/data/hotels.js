const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Hotel } = require("../config/config"); // Đảm bảo bạn export đúng model Taxi từ config

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS to allow frontend apps to connect

require('dotenv').config({path: '../../.env'});
const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_CONNECT_URI)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

app.get('/hotels/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;
        
        const ObjectId = mongoose.Types.ObjectId;
        const hotels = await Hotel.find({ places: new ObjectId(placeId) });

        if (hotels.length === 0) {
          return res.status(404).json({ message: "Không tìm thấy khách sạn nào cho địa điểm này." });
        }

        res.status(200).json(hotels); 
    } catch (error) {
        console.error("Lỗi khi lấy thông tin khách sạn:", error);
        res.status(500).json({ error: "Có lỗi xảy ra khi lấy thông tin khách sạn." });
    }
});

const port = 8002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
