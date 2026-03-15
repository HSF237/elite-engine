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
