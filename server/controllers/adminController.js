const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');

const getAdminStats = async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Last 7 days chart
    const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const chartData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: '%d %b', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
      }},
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalRevenue, totalOrders, totalProducts, totalUsers,
               chartData, recentOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats };