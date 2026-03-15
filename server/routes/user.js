const express = require('express')
const router = express.Router()
const { updateCart, updateWishlist, getSyncData, getAllUsers, getAddresses, addAddress, removeAddress } = require('../controllers/userController')
const { verifyToken, requireStaff } = require('../middleware/auth')

// All routes require authentication
router.use(verifyToken)

router.get('/sync', getSyncData)
router.post('/cart', updateCart)
router.post('/wishlist', updateWishlist)
router.get('/all', requireStaff, getAllUsers)

// Address routes
router.get('/address', verifyToken, getAddresses)
router.post('/address', verifyToken, addAddress)
router.delete('/address/:id', verifyToken, removeAddress)

module.exports = router
