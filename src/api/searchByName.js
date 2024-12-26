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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const placeName = req.query.name;
    try {
      await connectDB(); // Kết nối MongoDB
      const places = await Place.find({
        name: { $regex: placeName, $options: 'i' },
      });
      res.status(200).json(places);
    } catch (err) {
      console.error('Error fetching places:', err);
      res.status(500).json({ error: 'Error fetching places' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
