import React from 'react';
import { commonStyles } from './commonStyles';

function FeaturesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f8f9fa'
    }}>
      <header style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
            color: '#007bff',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>Features, More coming soon!</h1>
        </div>
      </header>
      <main style={{
        flex: 1,
        padding: '40px 20px',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%',
        paddingBottom: '80px' // Add padding to the bottom to prevent footer overlap
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '40px'
          }}>Unlock Your Stock Market Insights</h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>StockSense AI is a cutting-edge platform designed to provide you with real-time market analysis and insights to help you make informed investment decisions. Our team of experts is constantly working to improve the platform and provide the most accurate information possible.</p>
          
          {/* <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>Real-time Market Analysis</h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>Stay ahead of the market with our real-time analysis and insights. Our platform provides you with up-to-the-minute data and trends to help you make the best investment decisions.</p>
          
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>AI-Powered Predictions</h3>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>Our AI-powered predictions help you make informed investment decisions. Our advanced algorithms analyze market trends and provide you with accurate predictions to guide your investments.</p> */}
        </div>
      </main>
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
        position: 'relative', // Change to relative positioning
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

export default FeaturesPage;
