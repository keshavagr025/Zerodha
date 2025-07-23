import React, { useState, useEffect } from "react";

const Apps = () => {
  const [activeApp, setActiveApp] = useState(null);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [watchlist, setWatchlist] = useState([
    { symbol: 'NIFTY50', price: 19800, change: +1.2 },
    { symbol: 'BANKNIFTY', price: 44500, change: -0.8 },
    { symbol: 'SENSEX', price: 66000, change: +0.5 }
  ]);
  const [marketTimer, setMarketTimer] = useState(new Date());

  // Market timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setMarketTimer(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check if market is open (9:15 AM to 3:30 PM IST, Mon-Fri)
  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    // Market hours: 9:15 AM (555 minutes) to 3:30 PM (930 minutes)
    const marketOpen = 9 * 60 + 15; // 555 minutes
    const marketClose = 15 * 60 + 30; // 930 minutes
    
    return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose;
  };

  // Calculate SIP returns
  const calculateSIP = () => {
    const monthlyRate = sipRate / 100 / 12;
    const months = sipYears * 12;
    const futureValue = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = sipAmount * months;
    const totalReturns = futureValue - totalInvestment;
    
    return { futureValue, totalInvestment, totalReturns };
  };

  // Calculator function
  const handleCalculatorInput = (value) => {
    if (value === '=') {
      try {
        // Simple evaluation (in production, use a proper math parser)
        const result = eval(calculatorInput);
        setCalculatorResult(result.toString());
      } catch (error) {
        setCalculatorResult('Error');
      }
    } else if (value === 'C') {
      setCalculatorInput('');
      setCalculatorResult('');
    } else if (value === '⌫') {
      setCalculatorInput(prev => prev.slice(0, -1));
    } else {
      setCalculatorInput(prev => prev + value);
    }
  };

  const apps = [
    {
      id: 'calculator',
      name: 'Calculator',
      icon: '🧮',
      description: 'Basic calculator for quick calculations',
      color: '#007bff'
    },
    {
      id: 'sip-calculator',
      name: 'SIP Calculator',
      icon: '📈',
      description: 'Calculate SIP returns and plan investments',
      color: '#28a745'
    },
    {
      id: 'market-watch',
      name: 'Market Watch',
      icon: '📊',
      description: 'Live market indices and watchlist',
      color: '#dc3545'
    },
    {
      id: 'market-timer',
      name: 'Market Timer',
      icon: '⏰',
      description: 'Track market hours and trading sessions',
      color: '#ffc107'
    },
    {
      id: 'news',
      name: 'Market News',
      icon: '📰',
      description: 'Latest financial news and updates',
      color: '#17a2b8'
    },
    {
      id: 'portfolio-analyzer',
      name: 'Portfolio Analyzer',
      icon: '📋',
      description: 'Analyze your portfolio performance',
      color: '#6f42c1'
    }
  ];

  const renderAppContent = () => {
    switch (activeApp) {
      case 'calculator':
        return (
          <div className="calculator-app">
            <div className="calculator-display">
              <div className="calculator-input">{calculatorInput || '0'}</div>
              <div className="calculator-result">{calculatorResult}</div>
            </div>
            <div className="calculator-buttons">
              {['C', '⌫', '/', '*', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map((btn, index) => (
                <button
                  key={index}
                  className={`calc-btn ${btn === '=' ? 'equals' : ''}`}
                  onClick={() => handleCalculatorInput(btn)}
                  style={{
                    gridColumn: btn === '0' ? 'span 2' : 'span 1',
                    backgroundColor: ['+', '-', '*', '/', '='].includes(btn) ? '#ff9500' : '#f0f0f0',
                    color: ['+', '-', '*', '/', '='].includes(btn) ? 'white' : 'black'
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        );

      case 'sip-calculator':
        const sipResults = calculateSIP();
        return (
          <div className="sip-calculator">
            <div className="sip-inputs">
              <div className="input-group">
                <label>Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  min="500"
                  step="500"
                />
              </div>
              <div className="input-group">
                <label>Expected Return (% annually)</label>
                <input
                  type="number"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="0.5"
                />
              </div>
              <div className="input-group">
                <label>Investment Period (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            <div className="sip-results">
              <div className="result-card">
                <h4>Total Investment</h4>
                <p>₹{sipResults.totalInvestment.toLocaleString()}</p>
              </div>
              <div className="result-card">
                <h4>Total Returns</h4>
                <p style={{ color: 'green' }}>₹{sipResults.totalReturns.toLocaleString()}</p>
              </div>
              <div className="result-card">
                <h4>Maturity Value</h4>
                <p style={{ color: '#007bff', fontWeight: 'bold' }}>₹{sipResults.futureValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );

      case 'market-watch':
        return (
          <div className="market-watch">
            <div className="market-status">
              <h4>Market Status: <span style={{ color: isMarketOpen() ? 'green' : 'red' }}>
                {isMarketOpen() ? 'OPEN' : 'CLOSED'}
              </span></h4>
            </div>
            <div className="watchlist">
              {watchlist.map((item, index) => (
                <div key={index} className="watchlist-item">
                  <div className="symbol">{item.symbol}</div>
                  <div className="price">₹{item.price.toLocaleString()}</div>
                  <div className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                setWatchlist(prev => prev.map(item => ({
                  ...item,
                  change: (Math.random() - 0.5) * 4 // Random change between -2% to +2%
                })));
              }}
              style={{ marginTop: '15px', padding: '8px 16px' }}
            >
              Refresh Prices
            </button>
          </div>
        );

      case 'market-timer':
        return (
          <div className="market-timer">
            <div className="current-time">
              <h3>{marketTimer.toLocaleTimeString()}</h3>
              <p>{marketTimer.toLocaleDateString()}</p>
            </div>
            <div className="market-sessions">
              <div className="session">
                <h4>Regular Session</h4>
                <p>9:15 AM - 3:30 PM</p>
                <div className={`status ${isMarketOpen() ? 'open' : 'closed'}`}>
                  {isMarketOpen() ? 'OPEN' : 'CLOSED'}
                </div>
              </div>
              <div className="session">
                <h4>Pre-Market</h4>
                <p>9:00 AM - 9:15 AM</p>
                <div className="status closed">CLOSED</div>
              </div>
              <div className="session">
                <h4>After Hours</h4>
                <p>3:40 PM - 4:00 PM</p>
                <div className="status closed">CLOSED</div>
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="market-news">
            <h4>Latest Market News</h4>
            <div className="news-list">
              <div className="news-item">
                <h5>Market Rally Continues</h5>
                <p>Nifty 50 hits new highs as banking stocks surge...</p>
                <small>2 hours ago</small>
              </div>
              <div className="news-item">
                <h5>RBI Policy Update</h5>
                <p>Central bank maintains repo rate at current levels...</p>
                <small>4 hours ago</small>
              </div>
              <div className="news-item">
                <h5>Tech Stocks Outlook</h5>
                <p>IT sector shows strong Q4 earnings growth...</p>
                <small>6 hours ago</small>
              </div>
            </div>
          </div>
        );

      case 'portfolio-analyzer':
        return (
          <div className="portfolio-analyzer">
            <h4>Portfolio Quick Stats</h4>
            <div className="analyzer-stats">
              <div className="stat-item">
                <h5>Total Holdings</h5>
                <p>5 stocks</p>
              </div>
              <div className="stat-item">
                <h5>Sector Allocation</h5>
                <p>Banking: 40%, IT: 35%, Others: 25%</p>
              </div>
              <div className="stat-item">
                <h5>Risk Level</h5>
                <p style={{ color: 'orange' }}>Moderate</p>
              </div>
              <div className="stat-item">
                <h5>Diversification Score</h5>
                <p style={{ color: 'green' }}>7.2/10</p>
              </div>
            </div>
            <div className="analyzer-recommendations">
              <h5>Recommendations:</h5>
              <ul>
                <li>Consider adding pharmaceutical stocks</li>
                <li>Reduce concentration in banking sector</li>
                <li>Add defensive stocks for stability</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="apps-container">
      <div className="apps-header">
        <h3>Trading Apps & Tools</h3>
        <p>Essential tools for your trading journey</p>
      </div>

      {!activeApp ? (
        <div className="apps-grid">
          {apps.map((app) => (
            <div
              key={app.id}
              className="app-card"
              onClick={() => setActiveApp(app.id)}
              style={{ borderLeft: `4px solid ${app.color}` }}
            >
              <div className="app-icon">{app.icon}</div>
              <div className="app-info">
                <h4>{app.name}</h4>
                <p>{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="app-content">
          <div className="app-header">
            <button
              className="back-button"
              onClick={() => setActiveApp(null)}
            >
              ← Back to Apps
            </button>
            <h4>{apps.find(app => app.id === activeApp)?.name}</h4>
          </div>
          <div className="app-body">
            {renderAppContent()}
          </div>
        </div>
      )}

      <style jsx>{`
        .apps-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .apps-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .apps-header h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .apps-header p {
          color: #666;
          margin: 0;
        }

        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .app-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .app-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .app-icon {
          font-size: 32px;
          min-width: 50px;
        }

        .app-info h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .app-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .app-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .app-header {
          background: #f8f9fa;
          padding: 15px 20px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .back-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .back-button:hover {
          background: #0056b3;
        }

        .app-body {
          padding: 20px;
        }

        /* Calculator Styles */
        .calculator-app {
          max-width: 300px;
          margin: 0 auto;
        }

        .calculator-display {
          background: #000;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          text-align: right;
        }

        .calculator-input {
          font-size: 18px;
          margin-bottom: 10px;
          min-height: 25px;
        }

        .calculator-result {
          font-size: 24px;
          font-weight: bold;
        }

        .calculator-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .calc-btn {
          padding: 20px;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .calc-btn:hover {
          opacity: 0.8;
        }

        /* SIP Calculator Styles */
        .sip-calculator {
          max-width: 600px;
          margin: 0 auto;
        }

        .sip-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .sip-results {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .result-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .result-card h4 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .result-card p {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }

        /* Market Watch Styles */
        .market-status {
          text-align: center;
          margin-bottom: 20px;
        }

        .watchlist-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .watchlist-item:last-child {
          border-bottom: none;
        }

        .symbol {
          font-weight: bold;
          color: #333;
        }

        .price {
          font-size: 16px;
          font-weight: 500;
        }

        .change {
          font-weight: bold;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .change.positive {
          background: #d4edda;
          color: #155724;
        }

        .change.negative {
          background: #f8d7da;
          color: #721c24;
        }

        /* Market Timer Styles */
        .current-time {
          text-align: center;
          margin-bottom: 30px;
        }

        .current-time h3 {
          font-size: 32px;
          margin: 0;
          color: #007bff;
        }

        .market-sessions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .session {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .session h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .session p {
          margin: 0 0 15px 0;
          color: #666;
        }

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .status.open {
          background: #d4edda;
          color: #155724;
        }

        .status.closed {
          background: #f8d7da;
          color: #721c24;
        }

        /* News Styles */
        .news-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .news-item {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .news-item h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .news-item p {
          margin: 0 0 8px 0;
          color: #666;
        }

        .news-item small {
          color: #999;
        }

        /* Portfolio Analyzer Styles */
        .analyzer-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .stat-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .stat-item h5 {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
        }

        .stat-item p {
          margin: 0;
          font-weight: bold;
          color: #333;
        }

        .analyzer-recommendations {
          background: #e7f3ff;
          padding: 20px;
          border-radius: 8px;
        }

        .analyzer-recommendations h5 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .analyzer-recommendations ul {
          margin: 0;
          padding-left: 20px;
        }

        .analyzer-recommendations li {
          margin-bottom: 8px;
          color: #666;
        }

        @media (max-width: 768px) {
          .apps-container {
            padding: 15px;
          }

          .apps-grid {
            grid-template-columns: 1fr;
          }

          .app-card {
            padding: 15px;
          }

          .calculator-buttons {
            gap: 8px;
          }

          .calc-btn {
            padding: 15px;
            font-size: 16px;
          }

          .sip-inputs {
            grid-template-columns: 1fr;
          }

          .market-sessions {
            grid-template-columns: 1fr;
          }

          .analyzer-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Apps;