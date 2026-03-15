const express = require('express')
const router = express.Router()
const { getSyncData, updateCart, updateWishlist, getAllUsers } = require('../controllers/userController')
const { verifyToken, requireStaff } = require('../middleware/auth')

// All routes require authentication
router.use(verifyToken)

router.get('/sync', getSyncData)
router.post('/cart', updateCart)
router.post('/wishlist', updateWishlist)
router.get('/all', requireStaff, getAllUsers)

module.exports = router
