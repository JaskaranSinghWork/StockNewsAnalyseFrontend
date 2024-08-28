import React from 'react';

function ContactPage() {
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
          }}>Contact Us</h1>
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
          }}>Get in Touch</h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>Have questions or need more information? Reach out to us at:</p>
          <p style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Email: <a href="mailto:info@stockSenseAI.com" style={{color: '#007bff', textDecoration: 'none'}}>jazing14@gmail.com</a>
          </p>
          <p style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            {/* Phone: <a href="tel:+123-456-7890" style={{color: '#007bff', textDecoration: 'none'}}>+123-456-7890</a> */}
          </p>
          <p style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: '1.6'
          }}>
            {/* Address: <a href="https://maps.google.com/maps?q=123+Main+St,+Anytown,+USA" target="_blank" rel="noopener noreferrer" style={{color: '#007bff', textDecoration: 'none'}}>123 Main St, Anytown, USA</a> */}
          </p>
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

export default ContactPage;
