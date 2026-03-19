const mongoose = require('mongoose')

const colorSchema = new mongoose.Schema({ name: String, hex: String }, { _id: false })

const productSchema = new mongoose.Schema(
  {
    retailHeading: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Footwear', 'Apparel', 'Electronics', 'Beauty', 'Accessories', 'Home'],
    },
    regularPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 12, // Default 12% tax
    },
    productVoucher: {
      type: String,
      default: null,
    },
    productVoucherDiscount: {
      type: Number,
      default: 0,
    },
    searchKeywords: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
