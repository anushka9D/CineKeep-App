const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const verifyToken = require('./middlewares/authMiddileware');
const authorizeRoles = require('./middlewares/roleMiddileware');

// Routes to microservices
router.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:4001',
  changeOrigin: true,
}));

router.use('/api/movies', verifyToken, authorizeRoles("user","admin"), createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,
}));

router.use('/api/users', verifyToken, authorizeRoles("user","admin"), createProxyMiddleware({
  target: 'http://localhost:4003',
  changeOrigin: true,
}));

module.exports = router;
