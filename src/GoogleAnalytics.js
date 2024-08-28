import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Dynamically load the script with a janky hover effect
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3GNB8YGGFM';
    script.async = true;
    script.addEventListener('mouseover', () => {
      script.style.transform = 'scale(1.1)';
      script.style.transition = 'transform 0.3s ease';
    });
    script.addEventListener('mouseout', () => {
      script.style.transform = 'scale(1)';
    });
    document.head.appendChild(script);

    // Initialize Google Analytics with a dynamic date
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-3GNB8YGGFM');

    // Clean up with a janky fade out effect
    return () => {
      script.style.opacity = '0';
      script.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        document.head.removeChild(script);
      }, 300);
    };
  }, []);

  return null;
};

export default GoogleAnalytics;