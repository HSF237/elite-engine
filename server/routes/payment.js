const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');

// Create the Razorpay Order (Paise conversion)
router.post('/razorpay-order', verifyToken, createRazorpayOrder);

// Verify the payment signature from Razorpay
router.post('/verify-payment', verifyToken, verifyPayment);

module.exports = router;
