const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Taxi } = require("../config/config"); // Đảm bảo bạn export đúng model Taxi từ config

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS to allow frontend apps to connect

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Cahu")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

// Endpoint để lấy tất cả taxi liên quan đến một địa điểm (theo placeId)
app.get('/taxis/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;
        
        const ObjectId = mongoose.Types.ObjectId;
        const taxis = await Taxi.find({ places: new ObjectId(placeId) });

        if (taxis.length === 0) {
          return res.status(404).json({ message: "Không tìm thấy taxi nào cho địa điểm này." });
        }

        res.status(200).json(taxis); // Gửi dữ liệu taxi về phía client
    } catch (error) {
        console.error("Lỗi khi lấy taxi:", error);
        res.status(500).json({ error: "Có lỗi xảy ra khi lấy taxi." });
    }
});

const port = 8001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
