const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { verifyToken, requireStaff } = require('../middleware/auth')

// All routes require authentication
router.use(verifyToken)

// Sync cart/wishlist
router.get('/sync', userController.getSyncData)
router.post('/cart', userController.updateCart)
router.post('/wishlist', userController.updateWishlist)

// Profile & Settings
router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)

// Address Management
router.get('/address', userController.getAddresses)
router.post('/address', userController.addAddress)
router.delete('/address/:id', userController.removeAddress)

// Staff/Admin
router.get('/all', requireStaff, userController.getAllUsers)

module.exports = router
