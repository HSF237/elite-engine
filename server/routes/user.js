const express = require('express')
const router = express.Router()
const { getSyncData, updateCart, updateWishlist } = require('../controllers/userController')
const { verifyToken } = require('../middleware/auth')

// All routes require authentication
router.use(verifyToken)

router.get('/sync', getSyncData)
router.post('/cart', updateCart)
router.post('/wishlist', updateWishlist)

module.exports = router
