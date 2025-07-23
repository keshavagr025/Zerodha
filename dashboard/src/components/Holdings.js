import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = ({ userId }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useRealAPI, setUseRealAPI] = useState(false); // Toggle for testing

  // API Configuration
  const API_CONFIG = {
    ALPHA_VANTAGE: {
      key: 'demo', // Replace with your real API key
      baseUrl: 'https://www.alphavantage.co/query'
    }
  };

  // Mock holdings data
  const mockHoldings = [
    { symbol: 'RELIANCE', quantity: 10, buyPrice: 2450.00 },
    { symbol: 'TCS', quantity: 5, buyPrice: 3200.00 },
    { symbol: 'INFY', quantity: 8, buyPrice: 1450.00 },
    { symbol: 'HDFCBANK', quantity: 12, buyPrice: 1580.00 },
    { symbol: 'ITC', quantity: 50, buyPrice: 245.00 }
  ];

  // Generate realistic mock prices with market-like variations
  const generateMockLivePrice = (buyPrice, symbol) => {
    // Different volatility for different stocks
    const volatilityMap = {
      'RELIANCE': 0.03,   // 3% daily volatility
      'TCS': 0.025,       // 2.5% daily volatility
      'INFY': 0.035,      // 3.5% daily volatility
      'HDFCBANK': 0.028,  // 2.8% daily volatility
      'ITC': 0.02         // 2% daily volatility
    };

    const volatility = volatilityMap[symbol] || 0.03;
    
    // Generate random price movement (-volatility to +volatility)
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    
    // Add some trending bias (slight upward trend)
    const trendBias = 0.002; // 0.2% upward bias
    
    const finalChange = randomChange + trendBias;
    const livePrice = buyPrice * (1 + finalChange);
    
    // Round to 2 decimal places
    return Math.round(livePrice * 100) / 100;
  };

  // Function to get live price using Alpha Vantage (for real API)
  const getLivePriceAlphaVantage = async (symbol) => {
    try {
      const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol, // Try without .BSE first for demo
          apikey: API_CONFIG.ALPHA_VANTAGE.key
        },
        timeout: 10000
      });
      
      console.log(`API Response for ${symbol}:`, response.data);
      
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

  // Main function to fetch holdings with live prices
  const fetchHoldingsWithLivePrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching holdings...');
      let holdings = mockHoldings;

      if (useRealAPI) {
        console.log('Using real API...');
        
        // Real API mode
        const holdingsWithLivePrices = [];
        
        for (let i = 0; i < holdings.length; i++) {
          const holding = holdings[i];
          console.log(`Fetching price for ${holding.symbol}...`);
          
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
          
          // Add delay for rate limiting
          if (i < holdings.length - 1) {
            await delay(2000); // 2 second delay for testing
          }
        }
        
        setAllHoldings(holdingsWithLivePrices);
        
      } else {
        console.log('Using mock data...');
        
        // Mock mode - simulate API delay
        await delay(1500);
        
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
      
      console.log('Holdings loaded successfully');
      
    } catch (error) {
      setError('Failed to fetch holdings data: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldingsWithLivePrices();
  }, [userId, useRealAPI]);

  // Prepare data for chart
  const labels = allHoldings.map((stock) => stock.symbol);
  const data = {
    labels,
    datasets: [
      {
        label: "Live Price",
        data: allHoldings.map((stock) => stock.livePrice),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading Holdings...</h3>
        <p>
          {useRealAPI 
            ? 'Fetching live prices from market data provider...' 
            : 'Generating realistic mock prices...'
          }
        </p>
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          <small>Mode: {useRealAPI ? 'Real API' : 'Mock Data'}</small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error</h3>
        <p>{error}</p>
        <div style={{ marginTop: '15px' }}>
          <button onClick={fetchHoldingsWithLivePrices} style={{ marginRight: '10px' }}>
            Retry
          </button>
          <button onClick={() => setUseRealAPI(!useRealAPI)}>
            Switch to {useRealAPI ? 'Mock' : 'Real API'} Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="holdings-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 className="title">Holdings ({allHoldings.length})</h3>
        <div>
          <span style={{ 
            marginRight: '15px', 
            padding: '5px 10px',
            backgroundColor: useRealAPI ? '#e8f5e8' : '#fff3cd',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: useRealAPI ? '#155724' : '#856404'
          }}>
            {useRealAPI ? '🔴 Live API' : '🟡 Mock Data'}
          </span>
          <button 
            onClick={() => setUseRealAPI(!useRealAPI)} 
            style={{ marginRight: '10px' }}
          >
            Switch to {useRealAPI ? 'Mock' : 'Live'} Mode
          </button>
          <button onClick={fetchHoldingsWithLivePrices}>
            Refresh Prices
          </button>
        </div>
      </div>
      
      <div className="holdings-summary" style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px' 
      }}>
        <div className="summary-card" style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h4>Total Current Value</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            ₹{allHoldings.reduce((sum, stock) => sum + stock.currentValue, 0).toFixed(2)}
          </p>
        </div>
        <div className="summary-card" style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h4>Total P&L</h4>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: allHoldings.reduce((sum, stock) => sum + stock.profitLoss, 0) >= 0 ? 'green' : 'red' 
          }}>
            ₹{allHoldings.reduce((sum, stock) => sum + stock.profitLoss, 0).toFixed(2)}
          </p>
        </div>
        <div className="summary-card" style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          flex: 1,
          textAlign: 'center'
        }}>
          <h4>Total Invested</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#6c757d' }}>
            ₹{allHoldings.reduce((sum, stock) => sum + (stock.quantity * stock.buyPrice), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <table className="holdings-table" style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Symbol</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Quantity</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Buy Price</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Live Price</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Current Value</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>P&L</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>P&L %</th>
          </tr>
        </thead>
        <tbody>
          {allHoldings.map((stock, i) => {
            const plPercentage = ((stock.livePrice - stock.buyPrice) / stock.buyPrice) * 100;
            return (
              <tr key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{stock.symbol}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{stock.quantity}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{stock.buyPrice.toFixed(2)}</td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontWeight: 'bold',
                  color: stock.livePrice > stock.buyPrice ? 'green' : stock.livePrice < stock.buyPrice ? 'red' : 'black'
                }}>
                  ₹{stock.livePrice.toFixed(2)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{stock.currentValue.toFixed(2)}</td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontWeight: 'bold',
                  color: stock.profitLoss >= 0 ? "green" : "red" 
                }}>
                  {stock.profitLoss >= 0 ? '+' : ''}₹{stock.profitLoss.toFixed(2)}
                </td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontWeight: 'bold',
                  color: plPercentage >= 0 ? "green" : "red" 
                }}>
                  {plPercentage >= 0 ? '+' : ''}{plPercentage.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="chart-container">
        <VerticalGraph data={data} />
      </div>
    </>
  );
};

export default Holdings;  