const yahooFinance = require("yahoo-finance2").default;

const fetchLivePrice = async (symbol) => {
  try {
    const fullSymbol = symbol.includes(".NS") ? symbol : `${symbol}.NS`;
    const quote = await yahooFinance.quote(fullSymbol);
    return quote.regularMarketPrice;
  } catch (err) {
    console.error("Error fetching price for", symbol, err.message);
    return 0;
  }
};

module.exports = fetchLivePrice;
