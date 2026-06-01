const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/place', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;