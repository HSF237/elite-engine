const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController')
const { verifyToken, requireStaff } = require('../middleware/auth')

// Store files in memory so we can send them to Cloudinary as buffers
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

// Public
router.get('/', getProducts)
router.get('/:id', getProductById)

// Staff only
router.post('/', verifyToken, requireStaff, upload.array('images', 4), createProduct)
router.put('/:id', verifyToken, requireStaff, updateProduct)
router.delete('/:id', verifyToken, requireStaff, deleteProduct)

module.exports = router
