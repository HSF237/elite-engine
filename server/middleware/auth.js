const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ── Verify JWT token from Authorization header ──────────────────────────────
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-passwordHash')
    if (!req.user) return res.status(401).json({ message: 'User not found.' })
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// ── Allow only staff or admin ────────────────────────────────────────────────
const requireStaff = (req, res, next) => {
  if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Staff only.' })
  }
  next()
}

module.exports = { verifyToken, requireStaff }
