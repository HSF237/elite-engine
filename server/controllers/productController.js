const Product = require('../models/Product')
const cloudinary = require('../utils/cloudinary')

// GET /api/products — public
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, limit = 50 } = req.query
    let query = Product.find({ inStock: true })

    if (category && category !== 'All') query = query.where('category').equals(category)
    if (minPrice) query = query.where('discountPrice').gte(Number(minPrice))
    if (maxPrice) query = query.where('discountPrice').lte(Number(maxPrice))

    if (sort === 'price_asc') query = query.sort({ discountPrice: 1 })
    else if (sort === 'price_desc') query = query.sort({ discountPrice: -1 })
    else if (sort === 'rating') query = query.sort({ rating: -1 })
    else query = query.sort({ createdAt: -1 })

    const products = await query.limit(Number(limit))
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/:id — public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/products — staff only
const createProduct = async (req, res) => {
  try {
    const {
      retailHeading, longDescription, category, regularPrice,
      discountPrice, deliveryCharge, sizes, colors, department,
    } = req.body

    // Upload images to Cloudinary if files were sent
    let images = []
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
            folder: 'elite-store/products',
          })
        )
      )
      images = uploads.map(u => u.secure_url)
    } else if (req.body.images) {
      // Accept image URLs directly (from the URL input in the form)
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images]
      images = images.filter(Boolean)
    }

    const product = await Product.create({
      retailHeading,
      longDescription,
      category,
      regularPrice: Number(regularPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      deliveryCharge: Number(deliveryCharge) || 0,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [],
      colors: typeof colors === 'string' ? JSON.parse(colors) : colors || [],
      images,
      department: department || category,
      createdBy: req.user._id,
    })

    res.status(201).json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/products/:id — staff only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json({ product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/products/:id — staff only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json({ message: 'Product deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
