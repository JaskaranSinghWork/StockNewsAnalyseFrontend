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
  const [hasSearched, setHasSearched] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [searchStartTime, setSearchStartTime] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasSearched(true);
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
        <h1>StockSense AI: Intelligent Stock News Analysis</h1>
        <p className="tagline">Empowering investors with AI-driven insights from the latest stock news</p>
      </header>
      <main className="App-main">
        <section className="hero-section">
          <h2>Unlock the Power of AI in Stock Analysis</h2>
          <p>StockSense AI revolutionizes how investors interpret stock news, providing deep insights and projections to inform your investment decisions.</p>
          <button onClick={() => document.querySelector('.search-section').scrollIntoView({ behavior: 'smooth' })}>
            Get Started
          </button>
        </section>

        <section className="problem-solution">
          <h2>The Problem We're Solving</h2>
          <p>In today's fast-paced market, investors are overwhelmed by the sheer volume of news and struggle to extract meaningful insights quickly. Traditional analysis methods are time-consuming and often miss critical nuances.</p>
          <h3>Our Solution</h3>
          <p>StockSense AI leverages cutting-edge AI technology to analyze stock news articles, providing you with:</p>
          <ul>
            <li>Comprehensive analysis of article sentiment and content</li>
            <li>Short-term and long-term return projections</li>
            <li>Identification of key strengths, weaknesses, opportunities, and threats</li>
            <li>Time-saving insights to inform your investment strategy</li>
          </ul>
        </section>

        <section className="how-to-use">
          <h2>How to Use StockSense AI</h2>
          <ol>
            <li>Enter a stock ticker symbol (e.g., AAPL for Apple Inc.)</li>
            <li>Select the number of articles to analyze (1-20)</li>
            <li>Choose a start date for the news articles</li>
            <li>Click "Search" to initiate the AI analysis</li>
            <li>Review the comprehensive analysis and projections</li>
          </ol>
        </section>

        <div className={`search-section ${hasSearched ? 'searched' : ''}`}>
          <h2>Start Your AI-Powered Stock Analysis</h2>
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
                max="20"
                value={numArticles}
                onChange={(e) => setNumArticles(Number(e.target.value))}
                className="range-slider"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {loading && (
            <div className="loading">
              <p>Fetching and analyzing articles...</p>
              <p>Estimated time: {estimatedTime} seconds</p>
              <p>Elapsed time: {elapsedTime} seconds</p>
            </div>
          )}
          {status && <div className="status">{status}</div>}
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>
        <div className="results-section">
          {finalAnalysis && (
            <section className="final-analysis">
              <h2>Final Summary Analysis</h2>
              {renderMarkdown(finalAnalysis)}
            </section>
          )}
          {articles.length > 0 && (
            <section className="articles">
              <h2>Analyzed Articles</h2>
              {articles.map((article, index) => (
                <article key={index} className="article">
                  <h3>{article.title}</h3>
                  <p className="article-meta">
                    <span>Published: {article.published_at}</span>
                  </p>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read full article
                  </a>
                  <div className="article-analysis">
                    <h4>Analysis</h4>
                    {renderMarkdown(article.analysis)}
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <footer className="App-footer">
        <h3>About StockSense AI</h3>
        <p>StockSense AI is a cutting-edge tool that combines the power of AI with financial news analysis to provide investors with actionable insights.</p>
        <p>Powered by Google's Gemini API</p>
        <p>Backend built with Flask and hosted on PythonAnywhere</p>
        <p>Frontend built with React.js and hosted on Netlify</p>
        <p>Contact: jazing14@gmail.com</p>
        <p>Developed by Jaskaran Singh</p>
      </footer>
    </div>
  );
}

export default App;
