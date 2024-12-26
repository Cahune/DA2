const express = require("express");
const router = express.Router();
const { Hotel } = require("../config/config"); 

router.get('/:placeId', async (req, res) => {
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

module.exports = router;
