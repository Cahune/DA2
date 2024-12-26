const express = require('express');
const router = express.Router();
const { Taxi } = require("../config/config");

// Endpoint để lấy tất cả taxi liên quan đến một địa điểm (theo placeId)
router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;
  try {
    const taxis = await Taxi.find({ places: placeId });
    if (taxis.length === 0) {
      return res.status(404).json({ message: 'No taxis found for this place.' });
    }
    res.json(taxis);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching taxis.' });
  }
});

module.exports = router;
