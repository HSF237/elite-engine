const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Get keys from ENV or use placeholders
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_elite_2024_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_elite_2024_secret';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Create a Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    // Razorpay amount is in Paise (INR * 100)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ message: 'Error initiating payment.' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ 
        message: "Payment verified successfully.", 
        verified: true 
      });
    } else {
      return res.status(400).json({ 
        message: "Invalid signature. Payment could be tampered.", 
        verified: false 
      });
    }
  } catch (err) {
    console.error('Verification Error:', err);
    res.status(500).json({ message: err.message });
  }
};
