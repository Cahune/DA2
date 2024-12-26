import mongoose from 'mongoose';
import { Place } from '../../config/config';

const MONGODB_CONNECT_URI = process.env.MONGODB_CONNECT_URI;

// Hàm kết nối MongoDB
const connectDB = async () => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(MONGODB_CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

app.get('/api/searchByName', async (req, res) => {
    const placeName = req.query.name; // Lấy tên từ query
    try {
        if (!placeName) {
            return res.status(400).json({ error: "Thiếu tham số 'name'" });
        }

        const places = await Place.find({
            name: { $regex: placeName, $options: 'i' } // Tìm kiếm tên
        });

        res.status(200).json(places); // Trả về danh sách kết quả
    } catch (err) {
        console.error('Error fetching places:', err);
        res.status(500).json({ error: 'Error fetching places' });
    }
});
