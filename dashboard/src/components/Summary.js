import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = ({ userId }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // API Configuration
  const API_CONFIG = {
    ALPHA_VANTAGE: {
      key: 'demo',
      baseUrl: 'https://www.alphavantage.co/query'
    }
  };

  // Mock holdings data (same as Holdings component)
  const mockHoldings = [
    { symbol: 'RELIANCE', quantity: 10, buyPrice: 2450.00 },
    { symbol: 'TCS', quantity: 5, buyPrice: 3200.00 },
    { symbol: 'INFY', quantity: 8, buyPrice: 1450.00 },
    { symbol: 'HDFCBANK', quantity: 12, buyPrice: 1580.00 },
    { symbol: 'ITC', quantity: 50, buyPrice: 245.00 }
  ];

  // Mock equity data
  const mockEquityData = {
    marginAvailable: 3740,
    marginsUsed: 0,
    openingBalance: 3740
  };

  // Generate realistic mock prices
  const generateMockLivePrice = (buyPrice, symbol) => {
    const volatilityMap = {
      'RELIANCE': 0.03,
      'TCS': 0.025,
      'INFY': 0.035,
      'HDFCBANK': 0.028,
      'ITC': 0.02
    };

    const volatility = volatilityMap[symbol] || 0.03;
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendBias = 0.002;
    const finalChange = randomChange + trendBias;
    const livePrice = buyPrice * (1 + finalChange);
    
    return Math.round(livePrice * 100) / 100;
  };

  // Function to get live price using Alpha Vantage
  const getLivePriceAlphaVantage = async (symbol) => {
    try {
      const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: API_CONFIG.ALPHA_VANTAGE.key
        },
        timeout: 10000
      });
      
      const quote = response.data['Global Quote'];
      if (quote && quote['05. price']) {
        return parseFloat(quote['05. price']);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch holdings with live prices
  const fetchHoldingsWithLivePrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let holdings = mockHoldings;

      if (useRealAPI) {
        const holdingsWithLivePrices = [];
        
        for (let i = 0; i < holdings.length; i++) {
          const holding = holdings[i];
          const livePrice = await getLivePriceAlphaVantage(holding.symbol);
          
          if (livePrice) {
            const currentValue = holding.quantity * livePrice;
            const totalInvested = holding.quantity * holding.buyPrice;
            const profitLoss = currentValue - totalInvested;
            
            holdingsWithLivePrices.push({
              ...holding,
              livePrice,
              currentValue,
              profitLoss
            });
          } else {
            // Fallback to mock price if API fails
            const mockPrice = generateMockLivePrice(holding.buyPrice, holding.symbol);
            const currentValue = holding.quantity * mockPrice;
            const totalInvested = holding.quantity * holding.buyPrice;
            const profitLoss = currentValue - totalInvested;
            
            holdingsWithLivePrices.push({
              ...holding,
              livePrice: mockPrice,
              currentValue,
              profitLoss
            });
          }
          
          if (i < holdings.length - 1) {
            await delay(2000);
          }
        }
        
        setAllHoldings(holdingsWithLivePrices);
        
      } else {
        // Mock mode
        await delay(1000);
        
        const holdingsWithLivePrices = holdings.map(holding => {
          const livePrice = generateMockLivePrice(holding.buyPrice, holding.symbol);
          const currentValue = holding.quantity * livePrice;
          const totalInvested = holding.quantity * holding.buyPrice;
          const profitLoss = currentValue - totalInvested;
          
          return {
            ...holding,
            livePrice,
            currentValue,
            profitLoss
          };
        });
        
        setAllHoldings(holdingsWithLivePrices);
      }
      
      setLastUpdated(new Date());
      
    } catch (error) {
      setError('Failed to fetch holdings data: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchHoldingsWithLivePrices();
    
    const interval = setInterval(() => {
      if (!loading) {
        fetchHoldingsWithLivePrices();
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [userId, useRealAPI]);

  // Calculate summary values
  const totalCurrentValue = allHoldings.reduce((sum, stock) => sum + stock.currentValue, 0);
  const totalInvestment = allHoldings.reduce((sum, stock) => sum + (stock.quantity * stock.buyPrice), 0);
  const totalProfitLoss = allHoldings.reduce((sum, stock) => sum + stock.profitLoss, 0);
  const totalPLPercentage = totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}k`;
    }
    return amount.toFixed(2);
  };

  return (
    <>
      <div className="username">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h6>Hi, User!</h6>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {lastUpdated && (
              <small style={{ color: '#666', fontSize: '11px' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </small>
            )}
            <button 
              onClick={fetchHoldingsWithLivePrices}
              disabled={loading}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⟳' : '↻'}
            </button>
            <button 
              onClick={() => setUseRealAPI(!useRealAPI)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: useRealAPI ? '#28a745' : '#ffc107',
                color: useRealAPI ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {useRealAPI ? 'Live' : 'Mock'}
            </button>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{formatCurrency(mockEquityData.marginAvailable)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>{mockEquityData.marginsUsed}</span>
            </p>
            <p>
              Opening balance <span>{formatCurrency(mockEquityData.openingBalance)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading holdings data...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            <p>Error: {error}</p>
            <button onClick={fetchHoldingsWithLivePrices} style={{ marginTop: '10px' }}>
              Retry
            </button>
          </div>
        ) : (
          <div className="data">
            <div className="first">
              <h3 className={totalProfitLoss >= 0 ? "profit" : "loss"}>
                {totalProfitLoss >= 0 ? '+' : ''}₹{formatCurrency(Math.abs(totalProfitLoss))} 
                <small>
                  {totalPLPercentage >= 0 ? '+' : ''}{totalPLPercentage.toFixed(2)}%
                </small>
              </h3>
              <p>P&L</p>
            </div>
            <hr />

            <div className="second">
              <p>
                Current Value <span>₹{formatCurrency(totalCurrentValue)}</span>
              </p>
              <p>
                Investment <span>₹{formatCurrency(totalInvestment)}</span>
              </p>
            </div>
          </div>
        )}
        <hr className="divider" />
      </div>

      {/* Add some CSS for the loss class */}
      <style jsx>{`
        .profit {
          color: green;
        }
        .loss {
          color: red;
        }
        .section {
          margin-bottom: 20px;
        }
        .data {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
        }
        .first {
          text-align: left;
        }
        .second {
          text-align: right;
        }
        .divider {
          margin: 15px 0;
          border: none;
          border-top: 1px solid #eee;
        }
        hr:not(.divider) {
          border: none;
          border-left: 1px solid #eee;
          height: 40px;
          margin: 0 15px;
        }
      `}</style>
    </>
  );
};

export default Summary;