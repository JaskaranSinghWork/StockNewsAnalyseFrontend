import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faBell, faSearch, faBookOpen, faLock } from '@fortawesome/free-solid-svg-icons';

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
  const [activeTab, setActiveTab] = useState('home');
  
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
      {/* ... rest of the JSX ... */}
      <section id="features" className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
            <h3>AI-Powered Analysis</h3>
            <p>Our advanced AI analyzes multiple news articles, performs sentiment analysis, and detects market trends to provide comprehensive insights.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faBell} className="feature-icon" />
            <h3>Customizable Alerts</h3>
            <p>Set up personalized alerts for specific stocks, price movements, volume changes, or news topics. Choose daily, weekly, or monthly notifications.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faSearch} className="feature-icon" />
            <h3>Enhanced Search</h3>
            <p>Easily find and analyze any stock with our powerful search functionality and auto-suggestions.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faBookOpen} className="feature-icon" />
            <h3>Educational Resources</h3>
            <p>Access tutorials, guides, and a comprehensive glossary to better understand stock market basics and AI-generated insights.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faLock} className="feature-icon" />
            <h3>Data Privacy & Security</h3>
            <p>Your data is protected with state-of-the-art security measures. We're transparent about how your information is used and stored.</p>
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
            {/* Add a relevant app screenshot or illustration */}
          </div>
        </div>
        <div className="work-step">
          <div className="step-image">
            {/* Add an illustration of AI processing articles */}
          </div>
          <div className="step-content">
            <h3>2. AI-Powered Analysis</h3>
            <p>Our AI scans and analyzes recent news articles, performs sentiment analysis, and correlates with financial data to generate comprehensive insights.</p>
          </div>
        </div>
        <div className="work-step">
          <div className="step-content">
            <h3>3. Receive Insights</h3>
            <p>Get detailed analysis results, including sentiment scores, trend predictions, and estimated returns.</p>
          </div>
          <div className="step-image">
            {/* Add a screenshot of analysis results */}
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <h2>Pricing Plans</h2>
        <div className="pricing-grid">
          <div className="pricing-plan">
            <h3>Basic</h3>
            <p className="price">$9.99/month</p>
            <ul>
              <li>5 stock analyses per month</li>
              <li>Basic alerts</li>
              <li>7-day history</li>
            </ul>
            <button>Choose Plan</button>
          </div>
          <div className="pricing-plan featured">
            <h3>Pro</h3>
            <p className="price">$19.99/month</p>
            <ul>
              <li>Unlimited stock analyses</li>
              <li>Advanced customizable alerts</li>
              <li>30-day history</li>
              <li>Priority support</li>
            </ul>
            <button>Choose Plan</button>
          </div>
          <div className="pricing-plan">
            <h3>Enterprise</h3>
            <p className="price">Contact Us</p>
            <ul>
              <li>Custom solutions</li>
              <li>API access</li>
              <li>Dedicated account manager</li>
            </ul>
            <button>Contact Sales</button>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"StockSense AI has revolutionized my investment strategy. The AI-powered insights have helped me make more informed decisions."</p>
            <p className="testimonial-author">- John D., Professional Investor</p>
          </div>
          <div className="testimonial">
            <p>"As a beginner investor, the educational resources and easy-to-understand analysis have been invaluable."</p>
            <p className="testimonial-author">- Sarah L., Novice Investor</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StockSense AI</h3>
            <p>Empowering investors with AI-driven insights.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 StockSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
// End of Selection
