const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, default: 'Razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'processing',
  },
  totalPrice: { type: Number, required: true },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);