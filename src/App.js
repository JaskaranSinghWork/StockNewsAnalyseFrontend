import React, { useState, useCallback, useEffect } from 'react';
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

    // Estimate time based on number of articles
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

      // Analyze each article individually
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
      
      // Generate final analysis
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
        <h1>Stock News Analyzer</h1>
      </header>
      <main className="App-main">
        <div className={`search-section ${hasSearched ? 'searched' : ''}`}>
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
        <p>Contact: jazing14@gmail.com</p>
        <p>So we'll argue and we'll compromise</p>
        <p>And realize that nothing's ever changed</p>
        <p>For all our mutual experience</p>
        <p>Our separate conclusions are the same</p>
        <p>Now we are forced to recognize our inhumanity</p>
        <p>Our reason coexists with our insanity</p>
        <p>For all our mutual experience</p>
        <p>Our separate conclusions are the same</p>
      </footer>
    </div>
  );
}

export default App;
