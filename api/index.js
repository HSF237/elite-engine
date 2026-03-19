const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

// Mock DB connection for Vercel
const connectDB = require('../server/config/db')
let isConnected = false

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))

// Import original routes
const authRoutes = require('../server/routes/auth')
const productRoutes = require('../server/routes/products')
const userRoutes = require('../server/routes/user')
const orderRoutes = require('../server/routes/order')
const reviewRoutes = require('../server/routes/reviews')
const analyticsRoutes = require('../server/routes/analytics')

// Connection Middleware
const ensureDB = async (req, res, next) => {
  if (isConnected && mongoose.connection.readyState === 1) return next()
  try {
    await connectDB()
    isConnected = true
    next()
  } catch (err) {
    console.error('Vercel DB Connect Error:', err)
    res.status(500).json({ message: 'Database initialization failed.' })
  }
}

// Routes
const router = express.Router()

// Direct ping handler (Bypass SPA fallback)
router.get('/ping', (req, res) => res.json({ 
  status: 'Elite Systems Operable 🟢', 
  timestamp: new Date().toISOString(),
  platform: 'Vercel Serverless'
}))

router.get('/health', (req, res) => res.json({ status: 'Elite Cloud Active 💎', timestamp: new Date() }))
router.use('/auth', ensureDB, authRoutes)
router.use('/products', ensureDB, productRoutes)
router.use('/user', ensureDB, userRoutes)
router.use('/orders', ensureDB, orderRoutes)
router.use('/reviews', ensureDB, reviewRoutes)
router.use('/analytics', ensureDB, analyticsRoutes)

// Mount
app.use('/api', router)
app.use('/', router)

// 404 High-Visibility Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found on Elite Gateway.', 
    details: { 
      url: req.url, 
      path: req.path, 
      method: req.method,
      resolved: 'api/index.js'
    } 
  })
})

module.exports = app
