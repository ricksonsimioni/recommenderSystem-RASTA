const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This means any request starting with "/api" will be proxied
    createProxyMiddleware({
      target: 'https://cors-anywhere.herokuapp.com/https://pms.rasta-project.tech', // Your actual API domain
      changeOrigin: true,
      secure: false, // Set to true if your API uses a valid SSL certificate
      pathRewrite: {
        '^/api': '/api', // Ensures "/api" is correctly forwarded
      },
    })
  );
};
