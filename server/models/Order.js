const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: { type: Number, default: 1 },
        size: String,
        color: String,
        image: String,
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
      age: Number,
      dob: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'GPAY', 'CARD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryTime: {
      type: String, // e.g., "2-3 Business Days" or specific date
      default: 'Assigning soon',
    },
    orderCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

// Generate a clean order code before saving
orderSchema.pre('save', function (next) {
  if (!this.orderCode) {
    this.orderCode = 'ELT-' + Math.random().toString(36).toUpperCase().substring(2, 10);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema)
