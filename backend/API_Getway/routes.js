const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const verifyToken = require('./middlewares/authMiddileware');
const authorizeRoles = require('./middlewares/roleMiddileware');

// Routes to microservices
router.use('/auth', createProxyMiddleware({
  target: 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // remove /auth before forwarding
  },
}));

router.use('/movies', verifyToken, authorizeRoles("user","admin"), createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: {
    '^/movies': '',
  },
}));

router.use('/users', verifyToken, authorizeRoles("user"), createProxyMiddleware({
  target: 'http://localhost:4003',
  changeOrigin: true,
  pathRewrite: {
    '^/users': '',
  },
}));

module.exports = router;
