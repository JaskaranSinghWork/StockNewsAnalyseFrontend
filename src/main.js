import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash/debounce';
import './App.css';
import GoogleAnalytics from './GoogleAnalytics';

function AnalysisPage({ analysis, setAnalysis, setShowFooter }) {
  const [stockTicker, setStockTicker] = useState('');
  const [articles, setArticles] = useState([]);
  const [numArticles, setNumArticles] = useState(1);
  const a = new Date()
  const [startDate, setStartDate] = useState(a);
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

  useEffect(() => {
    // Load analysis from localStorage on component mount
    const savedAnalysis = localStorage.getItem('analysis');
    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
    } else {
      // If no saved analysis, set up for auto-analysis
      setupAutoAnalysis();
    }
  }, []);

  const setupAutoAnalysis = () => {
    // Set the start date to 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    setStartDate(threeDaysAgo.toISOString().split('T')[0]);
  };

  useEffect(() => {
    // Save analysis to localStorage on change
    if (analysis) {
      localStorage.setItem('analysis', JSON.stringify(analysis));
    }
  }, [analysis]);

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
      
      // Save the entire analysis result
      setAnalysis({
        articles: analyzedArticles,
        finalAnalysis: finalAnalysisResponse.data.final_analysis
      });
      
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
    <div className="analysis-page" style={{
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <GoogleAnalytics />
      
      <div className="analysis-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          color: '#007bff', 
          marginBottom: '30px',
          textAlign: 'center'
        }}>Stock Analysis</h2>

        <form onSubmit={handleSubmit} className="search-form" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="form-group">
            <label htmlFor="stockTicker" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>Stock Ticker:</label>
            <input
              id="stockTicker"
              type="text"
              value={stockTicker}
              onChange={onInputChange}
              onBlur={handleStockTickerBlur}
              placeholder="e.g., AAPL"
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions" style={{
                listStyle: 'none',
                padding: '0',
                margin: '5px 0 0',
                backgroundColor: 'white',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                position: 'absolute',
                width: 'calc(100% - 60px)',
                zIndex: 1000
              }}>
                {suggestions.map((suggestion, index) => (
                  <li key={index} 
                      onClick={() => {
                        setStockTicker(suggestion);
                        setShowSuggestions(false);
                      }} 
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="numArticles" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>Number of Articles: {numArticles}</label>
            <input
              id="numArticles"
              type="range"
              min="1"
              max="20"
              value={numArticles}
              onChange={(e) => setNumArticles(Number(e.target.value))}
              className="range-slider"
              style={{ width: '100%' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>Start Date:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {loading && (
          <div className="loading" style={{
            margin: '20px 0',
            padding: '20px',
            backgroundColor: '#e9ecef',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <p>Fetching and analyzing articles...</p>
            <p>Estimated time: {estimatedTime} seconds</p>
            <p>Elapsed time: {elapsedTime} seconds</p>
          </div>
        )}

        {status && (
          <div className="status" style={{
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#e9ecef',
            borderRadius: '5px',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            {status}
          </div>
        )}

        {error && (
          <div className="error" style={{
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success" style={{
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {analysis && (
          <section className="analysis-results" style={{
            marginTop: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '30px'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: '#007bff', 
              marginBottom: '20px' 
            }}>Analysis Results</h3>
            
            <div className="final-analysis">
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Final Summary Analysis</h4>
              {renderMarkdown(analysis.finalAnalysis)}
            </div>
            
            {analysis.articles.length > 0 && (
              <div className="analyzed-articles" style={{ marginTop: '30px' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Analyzed Articles</h4>
                {analysis.articles.map((article, index) => (
                  <article key={index} className="article" style={{
                    margin: '20px 0',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <h5 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{article.title}</h5>
                    <p className="article-meta" style={{ 
                      fontSize: '0.9rem', 
                      color: '#6c757d', 
                      marginBottom: '10px' 
                    }}>
                      Published: {article.published_at}
                    </p>
                    <a href={article.link} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="read-more" 
                       style={{
                         display: 'inline-block',
                         padding: '8px 15px',
                         backgroundColor: '#007bff',
                         color: 'white',
                         borderRadius: '5px',
                         textDecoration: 'none',
                         fontSize: '0.9rem',
                         transition: 'background-color 0.3s ease'
                       }}
                       onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}>
                      Read full article
                    </a>
                    <div className="article-analysis" style={{ marginTop: '15px' }}>
                      <h6 style={{ fontSize: '1rem', marginBottom: '10px' }}>Analysis</h6>
                      {renderMarkdown(article.analysis)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default AnalysisPage;