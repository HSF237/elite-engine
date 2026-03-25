const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Allow review for any confirmed purchase (any status except Cancelled)
    const hasPurchased = await Order.findOne({
      customer: userId,
      'items.product': productId,
      orderStatus: { $nin: ['Cancelled'] }
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Only verified purchasers can leave reviews.' });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await review.save();

    // Update product rating average and review count
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviews: reviews.length
    });

    // Return populated review with user name
    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
