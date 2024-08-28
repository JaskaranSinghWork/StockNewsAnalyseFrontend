import React from 'react';

function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f4f5f7',
    }}>
      <header style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '0 auto',
          maxWidth: '1200px',
          padding: '0 20px'
        }}>
          <h1 style={{
            margin: 0,
            color: '#0056b3',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>How It Works</h1>
        </div>
      </header>
      <main style={{
        flex: 1,
        padding: '60px 20px',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%',
        paddingBottom: '100px' // Added extra padding for footer space
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#0056b3',
            marginBottom: '50px'
          }}>Our Process</h2>
          
          {[
            { title: 'Data Collection', description: 'We gather real-time data from various reliable sources, including stock exchanges, financial news outlets, and company reports.' },
            { title: 'AI Analysis', description: 'Our advanced AI algorithms process and analyze the collected data, identifying patterns and trends that might be missed by human analysts.' },
            { title: 'Prediction Generation', description: 'Based on the analysis, our AI generates predictions for stock performance, potential risks, and market trends.' },
            { title: 'User-Friendly Presentation', description: 'We present these insights in an easy-to-understand format, allowing you to make informed investment decisions quickly and confidently.' },
            { title: 'Continuous Learning', description: 'Our AI continuously learns from new data and outcomes, constantly improving its accuracy and adapting to changing market conditions.' }
          ].map((step, index) => (
            <div key={index} style={{
              marginBottom: '60px',
              textAlign: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                marginBottom: '20px',
                color: '#0056b3'
              }}>{`${index + 1}. ${step.title}`}</h3>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                marginBottom: '0'
              }}>{step.description}</p>
            </div>
          ))}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <a href="/contact" style={{
            display: 'inline-block',
            padding: '15px 30px',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: '#007bff',
            borderRadius: '5px',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease',
          }}>Get in Touch</a>
        </div>
      </main>
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
        position: 'relative', // Ensure footer does not overlap content
        marginTop: 'auto' // Push footer to the bottom
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: 0
          }}>&copy; 2024 StockSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HowItWorksPage;
