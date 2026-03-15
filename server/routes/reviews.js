const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createReview, getProductReviews } = require('../controllers/reviewController');

router.post('/', verifyToken, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
