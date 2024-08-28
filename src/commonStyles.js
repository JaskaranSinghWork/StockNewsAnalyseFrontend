const commonStyles = {
  app: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '20px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: '1200px',
    padding: '0 20px'
  },
  headerTitle: {
    margin: 0,
    color: '#007bff',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    padding: '40px 20px',
    margin: '0 auto',
    maxWidth: '800px',
    width: '100%',
    paddingBottom: '80px'
  },
  content: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  h2: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '20px'
  },
  h3: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '30px',
    marginBottom: '15px'
  },
  p: {
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '15px'
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: '20px 0',
    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    textAlign: 'center'
  }
};