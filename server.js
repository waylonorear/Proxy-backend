const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create proxy instances
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  followRedirects: true,
});

// Error handling for proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).json({
    error: 'Proxy error',
    message: err.message,
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Proxy endpoint - forward requests to target URL
app.all('/proxy/:pathType(v1|v2)/*', (req, res) => {
  const targetUrl = process.env[`TARGET_${req.params.pathType.toUpperCase()}`];

  if (!targetUrl) {
    return res.status(404).json({
      error: 'Target not configured',
      message: `No target configured for ${req.params.pathType}`,
    });
  }

  const path = req.params[0]; // Captures the remaining path
  const fullUrl = `${targetUrl}/${path}`;

  console.log(`Proxying ${req.method} ${req.originalUrl} -> ${fullUrl}`);

  proxy.web(req, res, {
    target: fullUrl,
    prependPath: false,
  });
});

// Generic proxy endpoint - forward to any URL
app.all('/api/*', (req, res) => {
  const targetUrl = process.env.TARGET_URL;

  if (!targetUrl) {
    return res.status(400).json({
      error: 'Missing configuration',
      message: 'TARGET_URL environment variable is not set',
    });
  }

  const path = req.originalUrl.replace('/api/', '');
  const fullUrl = `${targetUrl}/${path}`;

  console.log(`Proxying ${req.method} ${req.originalUrl} -> ${fullUrl}`);

  proxy.web(req, res, {
    target: fullUrl,
    prependPath: false,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Use /proxy/v1/* or /proxy/v2/* or /api/* to proxy requests',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET /health - Health check`);
  console.log(`  ALL /proxy/v1/* - Proxy to TARGET_V1 URL`);
  console.log(`  ALL /proxy/v2/* - Proxy to TARGET_V2 URL`);
  console.log(`  ALL /api/* - Proxy to TARGET_URL`);
});
