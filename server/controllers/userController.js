const User = require('../models/User')

// GET /api/user/sync
exports.getSyncData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.product')
      .populate('wishlist')

    res.json({
      cart: user.cart,
      wishlist: user.wishlist
    })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sync data' })
  }
}

// POST /api/user/cart
exports.updateCart = async (req, res) => {
  try {
    const { cart } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cart },
      { new: true }
    ).populate('cart.product')

    res.json({ cart: user.cart })
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' })
  }
}

// POST /api/user/wishlist
exports.updateWishlist = async (req, res) => {
  try {
    const { wishlist } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { wishlist },
      { new: true }
    ).populate('wishlist')

    res.json({ wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ message: 'Error updating wishlist' })
  }
}
// PROFILE MANAGEMENT
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, phone, age, dob, avatar } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, age, dob, avatar } },
      { new: true, runValidators: true }
    ).select('-passwordHash')
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' })
  }
}

// GET /api/user/all
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name email role createdAt')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' })
  }
}

// ADDRESS MANAGEMENT
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user.addresses || [])
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses' })
  }
}

const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    user.addresses.push(req.body)
    
    // If set as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id?.toString() !== user.addresses[user.addresses.length - 1]._id?.toString()) {
          addr.isDefault = false
        }
      })
    }
    
    await user.save()
    res.json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: 'Error adding address' })
  }
}

const removeAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id)
    await user.save()
    res.json(user.addresses)
  } catch (error) {
    res.status(500).json({ message: 'Error removing address' })
  }
}

module.exports = {
  updateCart,
  updateWishlist,
  getSyncData,
  getAllUsers,
  getAddresses,
  addAddress,
  removeAddress,
  getProfile,
  updateProfile
}
