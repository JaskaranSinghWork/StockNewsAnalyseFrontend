import React, { useState, useEffect } from 'react';
import './App.css';
import AnalysisPage from './main';
import ContactPage from './contact';  // Uncommented ContactPage import
//import HowItWorksPage from './howItWorks';  // Uncommented HowItWorksPage import
import FeaturesPage from './features';
import GoogleAnalytics from './GoogleAnalytics';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('analysis');
    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis));
    }
  }, []);

  useEffect(() => {
    if (analysis) {
      localStorage.setItem('analysis', JSON.stringify(analysis));
    }
  }, [analysis]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f0f4f8'
    }}>
      <GoogleAnalytics />
      <header className="App-header" style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="header-content" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0 auto',
          maxWidth: '1200px',
          padding: '0 20px'
        }}>
          <h1 style={{
            margin: 0,
            color: '#007bff',
            fontSize: '2.2rem',
            fontWeight: 'bold'
          }}>StockSense AI</h1>
          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {['Home', 'Analysis',  'Features', 'Contact'].map((item) => ( // 'How It Works',
                <li key={item} onClick={() => handlePageChange(item.toLowerCase().replace(' ', ''))} style={{
                  cursor: 'pointer',
                  margin: '0 15px',
                  fontSize: '1.1rem',
                  color: currentPage === item.toLowerCase().replace(' ', '') ? '#007bff' : '#333',
                  transition: 'color 0.3s ease, transform 0.3s ease',
                  fontWeight: currentPage === item.toLowerCase().replace(' ', '') ? 'bold' : 'normal',
                  padding: '10px',
                  borderRadius: '5px'
                }}>
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="App-main" style={{
        flex: 1,
        padding: '40px 20px',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%',
        paddingBottom: currentPage === 'home' ? '80px' : '20px'  // Adjust padding for footer space
      }}>
        {currentPage === 'home' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h2 style={{
              marginBottom: '30px',
              fontSize: '2.8rem',
              fontWeight: 'bold',
              color: '#007bff'
            }}>Unlock Your Stock Market Potential</h2>
            <div style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              position: 'relative'
            }}>
              <img src="path-to-your-demo-image.png" alt="Demo Coming Soon" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }} />
              <video controls style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <source src="path-to-your-demo-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="features-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginTop: '40px'
            }}>
              {[
                { icon: 'chart-line', title: 'Real-time Market Analysis', description: 'Stay ahead of the market with our real-time analysis and insights.' },
                { icon: 'calculator', title: 'Accurate Predictions', description: 'Our AI-powered predictions help you make informed investment decisions.' }
              ].map((feature, index) => (
                <div key={index} className="feature" style={{
                  padding: '30px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  textAlign: 'center'
                }}>
                  <i className={`fas fa-${feature.icon}`} style={{ fontSize: '36px', color: '#007bff', marginBottom: '20px' }}></i>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '15px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{feature.description}</p>
                </div>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              marginTop: '40px'
            }}>
              <button onClick={() => handlePageChange('analysis')} style={{
                padding: '15px 30px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                Try Now
              </button>
            </div>
          </div>
        )}
        {currentPage === 'analysis' && <AnalysisPage analysis={analysis} setAnalysis={setAnalysis} />}
        {/* {currentPage === 'howitworks' && <HowItWorksPage />} */}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>
      {currentPage === 'home' && (
        <footer style={{
          backgroundColor: '#007bff',
          color: 'white',
          textAlign: 'center',
          padding: '20px 0',
          width: '100%',
          marginTop: '40px'  // Added marginTop for additional gap
        }}>
          <p style={{ margin: 0 }}>© 2024 StockSense AI. All rights reserved.</p>
          <p style={{ margin: '10px 0 0', fontSize: '0.9rem' }}>Developed by Jaskaran Singh | Contact: <a href="mailto:jazing14@gmail.com" style={{ color: 'white', textDecoration: 'underline' }}>jazing14@gmail.com</a></p>
        </footer>
      )}
    </div>
  );
}

export default App;
