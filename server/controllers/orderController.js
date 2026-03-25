const Order = require('../models/Order')
const User = require('../models/User')

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, promoCode, discountAmount } = req.body
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in manifest' })
    }

    const order = new Order({
      customer: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      promoCode,
      discountAmount,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      trackingHistory: [{
        status: 'Order Placed',
        location: 'Elite Engine System',
        description: 'Your mandate has been successfully logged.'
      }]
    })

    const savedOrder = await order.save()
    
    // Clear user's cart after successful order
    await User.findByIdAndUpdate(req.user._id, { cart: [] })
    
    res.status(201).json(savedOrder)
  } catch (error) {
    console.error('Order Sync Error:', error.message)
    res.status(500).json({ 
      message: 'Order settlement failed.', 
      error: error.message 
    })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' })
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' })
  }
}

const updateOrder = async (req, res) => {
  try {
    const { orderStatus, deliveryTime, paymentStatus, trackingUpdate } = req.body
    
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (orderStatus) order.orderStatus = orderStatus
    if (deliveryTime) order.deliveryTime = deliveryTime
    if (paymentStatus) order.paymentStatus = paymentStatus

    if (trackingUpdate && trackingUpdate.status && trackingUpdate.location) {
      order.trackingHistory.push({
        status: trackingUpdate.status,
        location: trackingUpdate.location,
        description: trackingUpdate.description || ''
      })
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' })
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrder
}
