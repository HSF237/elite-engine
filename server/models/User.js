const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned in queries by default
    },
    phone: String,
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        qty: { type: Number, default: 1 },
        size: String,
        color: String,
      },
    ],
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false },
        label: { type: String, default: 'Home' }, // Home, Office, etc.
      }
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
