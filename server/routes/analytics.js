const express = require('express');
const router = express.Router();
const { verifyToken, requireStaff } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/analyticsController');

router.get('/dashboard', verifyToken, requireStaff, getDashboardStats);

module.exports = router;
