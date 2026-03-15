const express = require('express')
const router = express.Router()
const { createOrder, getMyOrders, getAllOrders, updateOrder } = require('../controllers/orderController')
const { verifyToken, requireStaff } = require('../middleware/auth')

// Customer routes
router.post('/', verifyToken, createOrder)
router.get('/me', verifyToken, getMyOrders)

// Staff routes
router.get('/all', requireStaff, getAllOrders)
router.put('/:id', requireStaff, updateOrder)

module.exports = router
