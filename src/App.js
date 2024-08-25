import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash/debounce';
import './App.css';

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
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3GNB8YGGFM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3GNB8YGGFM');
</script>
  
    <div className="App">
      <header className="App-header">
        <h1>StockSense</h1>
      </header>

      <div className="analysis-form">
        <h3>
        Analyze articles using AI
    </h3>
    <ol>
        <li>Select a stock (ETFs, Indexes, etc., are not supported).</li>
        <li>Choose the number of articles to analyze. More articles will provide a more accurate assessment of the stock's performance.</li>
        <li>Each article takes approximately 10 seconds to process using Google's Gemini API.</li>
        <li>Select a date range for the articles.</li>
        <li>The AI will summarize the articles based on factors such as:
            <ul>
                <li>Probability of negative impact</li>
                <li>1-month returns</li>
                <li>1-year projections</li>
            </ul>
        </li>
        <li>A summary of all the articles will be displayed.</li>
    </ol>
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
            {loading ? 'Analyzing...' : 'Analyze'}
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

      {finalAnalysis && (
        <section className="analysis-results">
          <h2>Analysis Results</h2>
          <div className="final-analysis">
            <h3>Final Summary Analysis</h3>
            {renderMarkdown(finalAnalysis)}
          </div>
          {articles.length > 0 && (
            <div className="analyzed-articles">
              <h3>Analyzed Articles</h3>
              {articles.map((article, index) => (
                <article key={index} className="article">
                  <h4>{article.title}</h4>
                  <p className="article-meta">
                    <span>Published: {article.published_at}</span>
                  </p>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read full article
                  </a>
                  <div className="article-analysis">
                    <h5>Analysis</h5>
                    {renderMarkdown(article.analysis)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="App-footer">
        <div className="footer-content">
          <p>Developed by Jaskaran Singh</p>
          <p>Contact: jazing14@gmail.com</p>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 StockSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
