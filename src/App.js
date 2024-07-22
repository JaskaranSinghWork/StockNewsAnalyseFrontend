import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [stockTicker, setStockTicker] = useState('');
  const [articles, setArticles] = useState([]);
  const [numArticles, setNumArticles] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [finalAnalysis, setFinalAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setArticles([]);
    setFinalAnalysis('');
    setStatus('Initiating search...');

    try {
      setStatus('Fetching articles...');
      const response = await axios.post('https://jazing.pythonanywhere.com/search_articles', { 
        stock_ticker: stockTicker,
        num_articles: numArticles,
        start_date: startDate,
        end_date: endDate
      });

      setArticles(response.data.articles);
      setStatus('Articles fetched. Analyzing...');

      // Analyze each article individually
      const analyzedArticles = await Promise.all(response.data.articles.map(async (article) => {
        setStatus(`Analyzing article: ${article.title}`);
        const analysisResponse = await axios.post('https://jazing.pythonanywhere.com/analyze_article', {
          article,
          stock_ticker: stockTicker
        });
        return analysisResponse.data;
      }));

      setArticles(analyzedArticles);
      setStatus('Generating final analysis...');
      
      // Generate final analysis
      const finalAnalysisResponse = await axios.post('https://jazing.pythonanywhere.com/generate_final_analysis', {
        articles: analyzedArticles
      });
      setFinalAnalysis(finalAnalysisResponse.data.final_analysis);
      
      setSuccess('Articles and analysis successfully fetched and processed!');
      setStatus('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch or analyze articles. Please try again later.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  }, [stockTicker, numArticles, startDate, endDate]);

  const handleStockTickerChange = async (e) => {
    const value = e.target.value.toUpperCase();
    setStockTicker(value);
    setShowSuggestions(true);
    if (value.length > 1) {
      try {
        const response = await axios.get(`https://jazing.pythonanywhere.com/stock_suggestions?query=${value}`);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock News Analyzer</h1>
      </header>
      <main className="App-main">
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
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="stockTicker">Stock Ticker:</label>
              <input
                id="stockTicker"
                type="text"
                value={stockTicker}
                onChange={handleStockTickerChange}
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
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {loading && <div className="loading">Fetching and analyzing articles...</div>}
          {status && <div className="status">{status}</div>}
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>
      </main>
      <footer className="App-footer">
        <p>Contact: jazing14@gmail.com</p>
        <p> And as we stand upon the ledges of our lives with our respective similarities, it's either sadness or euphoria </p>
      </footer>
    </div>
  );
}

export default App;
