// backend/routes/MLRoute.js
const express = require("express");
const router = express.Router();
const { getPortfolioClustering } = require("../controllers/MLController");

// Endpoint: GET /api/ml/portfolio-clustering/:userId
router.get("/portfolio-clustering/:userId", getPortfolioClustering);

module.exports = router;
