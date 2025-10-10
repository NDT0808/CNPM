const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();

// Sử dụng CORS để cho phép frontend gọi tới
app.use(cors());

// Middleware để ghi log mọi request đến Gateway
app.use((req, res, next) => {
    console.log(`[Gateway] Received request: ${req.method} ${req.originalUrl}`);
    next();
});

// Định nghĩa các route và service tương ứng
const services = [
    {
        route: '/api/users',
        target: 'http://localhost:3001',
    },
    {
        route: '/api/products',
        target: 'http://localhost:3002',
    },
    {
        route: '/api/orders',
        target: 'http://localhost:3003',
    },
    {
        route: '/api/payments',
        target: 'http://localhost:3004',
    },
];

// Thiết lập proxy cho từng service
services.forEach(({ route, target }) => {
    const proxyOptions = {
        target,
        changeOrigin: true, // Cần thiết để proxy hoạt động đúng
        pathRewrite: {
            [`^${route}`]: '/',
        },
        
    };
    app.use(route, createProxyMiddleware(proxyOptions));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on http://localhost:${PORT}`);
});