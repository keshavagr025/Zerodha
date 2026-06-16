const { HoldingsModel } = require("../models/HoldingsModel");
const { kmeans } = require("ml-kmeans");
const yahooFinance = require("yahoo-finance2").default;

// Predefined fallback market beta and volatility for Indian stocks
// This ensures the API works even if yahoo-finance2 is rate-limited or offline.
const STOCK_METRICS_FALLBACK = {
  RELIANCE: { beta: 1.15, volatility: 0.022, sector: "Energy" },
  TCS: { beta: 0.90, volatility: 0.018, sector: "Technology" },
  INFY: { beta: 1.25, volatility: 0.026, sector: "Technology" },
  HDFCBANK: { beta: 1.05, volatility: 0.020, sector: "Finance" },
  ITC: { beta: 0.70, volatility: 0.015, sector: "FMCG" },
  BHARTIARTL: { beta: 0.95, volatility: 0.021, sector: "Telecom" },
  SBIN: { beta: 1.30, volatility: 0.028, sector: "Finance" },
  TATAPOWER: { beta: 1.40, volatility: 0.035, sector: "Utilities" },
  WIPRO: { beta: 1.10, volatility: 0.024, sector: "Technology" },
};

/**
 * Calculates stock volatility based on 30-day historical daily returns
 */
async function getStockMetrics(symbol) {
  const cleanSymbol = symbol.toUpperCase().replace(".NS", "");
  const fallback = STOCK_METRICS_FALLBACK[cleanSymbol] || { beta: 1.0, volatility: 0.02, sector: "Other" };

  try {
    const yahooSymbol = symbol.includes(".NS") ? symbol : `${symbol}.NS`;
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const queryOptions = {
      period1: thirtyDaysAgo.toISOString().split('T')[0],
      period2: today.toISOString().split('T')[0]
    };

    const history = await yahooFinance.historical(yahooSymbol, queryOptions);
    
    if (history && history.length > 5) {
      const prices = history.map(day => day.close).filter(Boolean);
      const returns = [];
      for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }
      
      const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
      const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
      const volatility = Math.sqrt(variance);
      
      // Rough Beta estimate relative to standard market volatility (approx 1.5%)
      const beta = volatility / 0.015;
      
      return {
        beta: Math.round(beta * 100) / 100,
        volatility: Math.round(volatility * 10000) / 10000,
        sector: fallback.sector
      };
    }
  } catch (err) {
    console.warn(`Yahoo Finance fetch failed for ${symbol}, using fallback metrics. Error:`, err.message);
  }
  
  return fallback;
}

exports.getPortfolioClustering = async (req, res) => {
  try {
    const userId = req.params.userId;
    let holdings = [];
    
    // Attempt to fetch holdings for the user if database has records
    if (userId && userId !== "mock") {
      holdings = await HoldingsModel.find({ userId });
    }
    
    // If no holdings found in DB, default to seed/mock portfolio so dashboard displays correctly
    if (!holdings || holdings.length === 0) {
      holdings = [
        { symbol: 'RELIANCE', quantity: 10, buyPrice: 2450.00 },
        { symbol: 'TCS', quantity: 5, buyPrice: 3200.00 },
        { symbol: 'INFY', quantity: 8, buyPrice: 1450.00 },
        { symbol: 'HDFCBANK', quantity: 12, buyPrice: 1580.00 },
        { symbol: 'ITC', quantity: 50, buyPrice: 245.00 }
      ];
    }

    if (holdings.length < 2) {
      return res.json({
        success: true,
        message: "Need at least 2 holdings to perform portfolio clustering.",
        clusters: holdings.map(h => ({
          symbol: h.symbol,
          quantity: h.quantity,
          buyPrice: h.buyPrice,
          cluster: 0,
          clusterName: "General Portfolio",
          beta: 1.0,
          volatility: 0.02
        }))
      });
    }

    // 1. Feature Extraction: Build feature vectors for K-Means
    const featureVectors = [];
    const enrichedHoldings = [];

    for (let h of holdings) {
      const symbol = h.symbol || h.name || "UNKNOWN";
      const metrics = await getStockMetrics(symbol);
      
      // Feature vector: [Beta (volatility multiplier), Volatility (daily variance)]
      featureVectors.push([metrics.beta, metrics.volatility]);
      
      enrichedHoldings.push({
        symbol,
        quantity: h.quantity || h.qty || 0,
        buyPrice: h.buyPrice || h.price || 0,
        beta: metrics.beta,
        volatility: metrics.volatility,
        sector: metrics.sector
      });
    }

    // 2. Perform KMeans Clustering
    // Let K = 3 if we have enough stocks, else scale K dynamically
    const K = Math.min(3, featureVectors.length);
    const kmeansResult = kmeans(featureVectors, K, {
      seed: 42 // constant seed for deterministic clusters
    });

    const clusters = kmeansResult.clusters;

    // 3. Label clusters based on average volatility of each group
    const clusterVolatilities = Array(K).fill(0).map(() => ({ sum: 0, count: 0 }));
    for (let i = 0; i < clusters.length; i++) {
      const clusterId = clusters[i];
      clusterVolatilities[clusterId].sum += featureVectors[i][1]; // Volatility index
      clusterVolatilities[clusterId].count += 1;
    }

    const clusterAverages = clusterVolatilities.map((c, id) => ({
      id,
      avgVol: c.count > 0 ? c.sum / c.count : 0
    }));

    // Sort clusters by average volatility ascending: Low, Medium, High Volatility
    clusterAverages.sort((a, b) => a.avgVol - b.avgVol);
    
    // Map cluster index to readable risk names
    const labelMapping = {};
    const labelNames = ["Low Volatility (Defensive)", "Medium Volatility (Moderate)", "High Volatility (Aggressive)"];
    
    clusterAverages.forEach((item, index) => {
      labelMapping[item.id] = {
        mappedId: index,
        name: labelNames[Math.min(index, labelNames.length - 1)]
      };
    });

    // 4. Map final results
    const clusteredHoldings = enrichedHoldings.map((h, i) => {
      const originalClusterId = clusters[i];
      const mapped = labelMapping[originalClusterId];
      return {
        ...h,
        cluster: mapped.mappedId,
        clusterName: mapped.name
      };
    });

    res.json({
      success: true,
      clusters: clusteredHoldings
    });
  } catch (error) {
    console.error("Error in getPortfolioClustering:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
