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
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed'
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
    const { orderStatus, deliveryTime, paymentStatus } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, deliveryTime, paymentStatus },
      { new: true }
    )
    res.json(order)
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
