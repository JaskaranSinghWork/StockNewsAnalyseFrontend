import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';
import debounce from 'lodash/debounce';

function App() {
  const [stockTicker, setStockTicker] = useState('');
  const [articles, setArticles] = useState([]);
  const [numArticles, setNumArticles] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [finalAnalysis, setFinalAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [searchStartTime, setSearchStartTime] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setArticles([]);
    setFinalAnalysis('');
    setStatus('Initiating search...');
    setSearchStartTime(Date.now());
    setElapsedTime(0);

    const estimatedTimePerArticle = 10; // seconds
    setEstimatedTime(numArticles * estimatedTimePerArticle);

    try {
      setStatus('Fetching articles...');
      const response = await axios.post('https://jazing.pythonanywhere.com/search_articles', { 
        stock_ticker: stockTicker,
        num_articles: numArticles,
        start_date: startDate
      });

      setArticles(response.data.articles);
      setStatus(`Found ${response.data.articles.length} articles. Analyzing...`);

      const analyzedArticles = await Promise.all(response.data.articles.map(async (article, index) => {
        setStatus(`Analyzing article ${index + 1} of ${response.data.articles.length}: ${article.title}`);
        try {
          const analysisResponse = await axios.post('https://jazing.pythonanywhere.com/analyze_article', {
            article,
            stock_ticker: stockTicker
          });
          return analysisResponse.data;
        } catch (error) {
          console.error(`Error analyzing article: ${article.title}`, error);
          setStatus(`Failed to analyze article: ${article.title}. Skipping to next.`);
          return {
            ...article,
            analysis: 'Analysis failed',
            estimated_returns_1_month: 'N/A',
            estimated_returns_1_year: 'N/A'
          };
        }
      }));

      setArticles(analyzedArticles);
      setStatus('Generating final analysis...');
      
      const finalAnalysisResponse = await axios.post('https://jazing.pythonanywhere.com/generate_final_analysis', {
        articles: analyzedArticles
      });
      setFinalAnalysis(finalAnalysisResponse.data.final_analysis);
      
      setSuccess(`Successfully analyzed ${analyzedArticles.length} articles!`);
      setStatus('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch or analyze articles. Please try again later.');
      setStatus('');
    } finally {
      setLoading(false);
      setSearchStartTime(null);
    }
  };

  const handleStockTickerChange = debounce(async (value) => {
    if (value.length > 1) {
      try {
        const response = await axios.get(`https://jazing.pythonanywhere.com/stock_suggestions?query=${value}`);
        setSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  const onInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setStockTicker(value);
    handleStockTickerChange(value);
  };

  const handleStockTickerBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const renderMarkdown = (content) => {
    if (typeof content === 'string') {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }
    return <p>{JSON.stringify(content)}</p>;
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('https://jazing.pythonanywhere.com/status');
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    if (loading) {
      const intervalId = setInterval(fetchStatus, 5000);
      return () => clearInterval(intervalId);
    }
  }, [loading]);

  useEffect(() => {
    let intervalId;
    if (loading && searchStartTime) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - searchStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [loading, searchStartTime]);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Discover New Investment Possibilities</h1>
          <p>AI-powered stock analysis at your fingertips</p>
          <div className="app-store-buttons">
            <button className="app-store">App Store</button>
            <button className="google-play">Google Play</button>
          </div>
        </div>
        <div className="hero-image">
          {/* Add mock-up images of your app here */}
        </div>
      </section>

      <section className="reinventing">
        <h2>Reinventing Stock Analysis Technology</h2>
        <p>StockSense AI leverages cutting-edge AI to analyze stock news, providing investors with deep insights and projections to inform investment decisions.</p>
        <button onClick={() => document.querySelector('#how-it-works').scrollIntoView({ behavior: 'smooth' })}>
          Discover More
        </button>
      </section>

      <section id="features" className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>AI-Powered Analysis</h3>
            <p>Our advanced AI analyzes multiple news articles to provide comprehensive insights.</p>
          </div>
          <div className="feature">
            <h3>24/7 Market Insights</h3>
            <p>Stay updated with real-time analysis of the latest stock news.</p>
          </div>
          <div className="feature">
            <h3>Customizable Alerts</h3>
            <p>Set up alerts for specific stocks or market conditions.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How StockSense AI Works</h2>
        <div className="work-step">
          <div className="step-content">
            <h3>1. Enter Stock Ticker</h3>
            <p>Simply input the stock ticker you're interested in analyzing.</p>
          </div>
          <div className="step-image">
            {/* Add a relevant app screenshot */}
          </div>
        </div>
        <div className="work-step">
          <div className="step-image">
            {/* Add another relevant app screenshot */}
          </div>
          <div className="step-content">
            <h3>2. AI-Powered Analysis</h3>
            <p>Our AI scans and analyzes recent news articles related to the stock.</p>
          </div>
        </div>
        
        <div className="analysis-form">
          <h3>Try It Now</h3>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="stockTicker">Stock Ticker:</label>
              <input
                id="stockTicker"
                type="text"
                value={stockTicker}
                onChange={onInputChange}
                onBlur={handleStockTickerBlur}
                placeholder="e.g., AAPL"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => {
                      setStockTicker(suggestion);
                      setShowSuggestions(false);
                    }}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="numArticles">Number of Articles: {numArticles}</label>
              <input
                id="numArticles"
                type="range"
                min="1"
                max="10"
                value={numArticles}
                onChange={(e) => setNumArticles(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Analyze'}
            </button>
          </form>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          {status && <div className="status">{status}</div>}
          <div className="elapsed-time">
            Elapsed Time: {elapsedTime}s (Estimated: {estimatedTime}s)
          </div>
        </div>
        {articles.length > 0 && (
          <div className="articles-list">
            <h3>Analysis Results:</h3>
            {articles.map((article, index) => (
              <div key={index} className="article-card">
                <h4>{article.title}</h4>
                <p>{article.summary}</p>
                <div className="article-analysis">
                  <p><strong>Analysis:</strong> {renderMarkdown(article.analysis)}</p>
                  <p><strong>Estimated Returns (1 Month):</strong> {article.estimated_returns_1_month}</p>
                  <p><strong>Estimated Returns (1 Year):</strong> {article.estimated_returns_1_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {finalAnalysis && (
          <div className="final-analysis">
            <h3>Final Analysis</h3>
            {renderMarkdown(finalAnalysis)}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>&copy; 2024 StockSense AI. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@stocksense.ai">support@stocksense.ai</a></p>
      </footer>
    </div>
  );
}

export default App;
