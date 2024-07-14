const express = require('express');
const cors = require('cors');
const process = require('process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv')
dotenv.config();
const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.CORS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Proxy configuration for API server
const apiProxy = createProxyMiddleware({
    target: process.env.API_SERVER1,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
});

// Proxy configuration for PDF server
const pdfProxy = createProxyMiddleware({
    target: process.env.API_SERVER2,
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
});

// Handle OPTIONS requests
app.options('*', cors(corsOptions));

// Use the proxies
app.use('/api/v1', apiProxy);
app.use('/pdf/v1', pdfProxy);

// Start the gateway server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Gateway server is running at http://localhost:${PORT}`);
});