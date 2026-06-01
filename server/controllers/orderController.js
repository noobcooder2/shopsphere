const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @POST /api/orders/create-razorpay-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount: amount * 100, // Razorpay needs paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/orders/place
const placeOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Verify Razorpay signature
    if (paymentMethod === 'Razorpay') {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Reduce stock for each item
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
      totalPrice: cart.totalPrice,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only owner or admin can see
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/orders/:id/status — admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') order.deliveredAt = Date.now();

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/all — admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};