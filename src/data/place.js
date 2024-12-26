const express = require('express');
const router = express.Router();
const { Place } = require('../models/place'); // Model Place

// Endpoint để tìm kiếm trong collection 'place' theo tên
router.get('/search-by-name', async (req, res) => {
  const placeName = req.query.name;
  try {
    const places = await Place.find({
      name: { $regex: placeName, $options: 'i' }
    });
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching places' });
  }
});

// Lấy thông tin địa điểm theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching place by ID' });
  }
});

module.exports = router;
