// backend/routes/holdings.js
const express = require('express');
const router = express.Router();
const HoldingsModel = require('../models/HoldingsModel');
const fetchIndianStockPrice = require('../utils/fetchIndianStockPrice');

router.get('/userHoldingsWithLive/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const holdings = await HoldingsModel.find({ userId });

    const holdingsWithLive = await Promise.all(
      holdings.map(async (h) => {
        const { livePrice, netChange, dayChangePercent } = await fetchIndianStockPrice(h.symbol);

        const currentValue = livePrice * h.quantity;
        const profitLoss = (livePrice - h.buyPrice) * h.quantity;

        return {
          _id: h._id,
          symbol: h.symbol,
          quantity: h.quantity,
          buyPrice: h.buyPrice,
          livePrice,
          currentValue,
          profitLoss,
          netChange,
          dayChangePercent,
        };
      })
    );

    res.json(holdingsWithLive);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

module.exports = router;
