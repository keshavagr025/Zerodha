require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/AuthRoute");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const uri = process.env.MONGODB_URL;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Models
const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { UsersModel } = require("./models/UsersModel");
const fetchLivePrice = require("./utils/fetchIndianStockPrice.js");

// Routes
app.use("/api/auth", authRoute);

app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/userHoldingsWithLive/:userId", async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({ userId: req.params.userId });

    const enriched = await Promise.all(
      holdings.map(async (h) => {
        const livePrice = await fetchLivePrice(h.symbol);
        const currentValue = livePrice * h.quantity;
        const profitLoss = (livePrice - h.buyPrice) * h.quantity;

        return {
          ...h._doc,
          livePrice,
          currentValue,
          profitLoss
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch live prices" });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});