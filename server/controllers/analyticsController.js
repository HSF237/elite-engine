const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    // Basic aggregation
    const totalOrders = await Order.countDocuments();
    const revenueStats = await Order.aggregate([
      { $group: { 
          _id: '$paymentStatus', 
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
      } }
    ]);

    const completedRevenue = revenueStats.find(s => s._id === 'Completed')?.total || 0;
    const pendingRevenue = revenueStats.find(s => s._id === 'Pending')?.total || 0;

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort('-createdAt')
      .limit(5);

    // Category performance (pseudo-aggregation based on current product counts)
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      revenue: completedRevenue,
      pendingRevenue,
      ordersCount: totalOrders,
      customerCount: totalCustomers,
      productCount: totalProducts,
      recentOrders,
      categoryStats: categories
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
