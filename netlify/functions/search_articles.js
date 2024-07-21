const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports.handler = async (event, context) => {
  const proxy = createProxyMiddleware({
    target: 'http://127.0.0.1:5000', // Your Flask server URL
    changeOrigin: true,
    pathRewrite: {
      '^/.netlify/functions': '', // remove base path
    },
  });

  return new Promise((resolve, reject) => {
    proxy(event, context, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};
