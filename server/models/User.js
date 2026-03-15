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
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    wishlist: [{ type: String }], // product IDs
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
