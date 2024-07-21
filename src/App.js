import React, { useState, useCallback } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [stockTicker, setStockTicker] = useState('');
  const [articles, setArticles] = useState([]);
  const [numArticles, setNumArticles] = useState(5);
  const [timeFrame, setTimeFrame] = useState(7);
  const [finalAnalysis, setFinalAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');

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
        time_frame: timeFrame
      });

      setStatus('Processing articles...');
      setArticles(response.data.articles);
      
      setStatus('Generating final analysis...');
      setFinalAnalysis(response.data.final_analysis);
      
      setSuccess('Articles and analysis successfully fetched!');
      setStatus('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch articles. Please try again later.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  }, [stockTicker, numArticles, timeFrame]);

  const renderMarkdown = (content) => {
    if (typeof content === 'string') {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }
    return <p>{JSON.stringify(content)}</p>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock News Analyzer</h1>
        <p>
          Enter a stock ticker to fetch and analyze recent news articles.
        </p>
      </header>
      <main>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label htmlFor="stockTicker">Stock Ticker:</label>
            <input
              id="stockTicker"
              type="text"
              value={stockTicker}
              onChange={(e) => setStockTicker(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL"
              required
            />
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
            <label htmlFor="timeFrame">Time Frame (days):</label>
            <input
              id="timeFrame"
              type="number"
              min="1"
              value={timeFrame}
              onChange={(e) => setTimeFrame(Number(e.target.value))}
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
                  <span>Author: {article.author}</span>
                  <span>Published: {article.published_at}</span>
                </p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read full article
                </a>
                <div className="article-content">
                  <h4>Content Summary</h4>
                  {renderMarkdown(typeof article.content === 'string' ? article.content.slice(0, 300) + '...' : 'Content not available')}
                </div>
                <div className="article-analysis">
                  <h4>Analysis</h4>
                  {renderMarkdown(article.analysis)}
                </div>
                <div className="time-frames">
                  <div className="time-frame">
                    <h5>Projection: 1 Month</h5>
                    <p>{article.estimated_returns_1_month || 'Not available'}</p>
                  </div>
                  <div className="time-frame">
                    <h5>Projection: 1 Year</h5>
                    <p>{article.estimated_returns_1_year || 'Not available'}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
