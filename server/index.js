require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')
const reviewRoutes = require('./routes/reviews')
const analyticsRoutes = require('./routes/analytics')
const paymentRoutes = require('./routes/payment')

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Database Connection Cache (Serverless Optimization) ──────────────────────
let isConnected = false
const ensureDB = async (req, res, next) => {
  if (isConnected && mongoose.connection.readyState === 1) return next()
  try {
    await connectDB()
    isConnected = true
    next()
  } catch (err) {
    console.error('Database connection failed:', err)
    res.status(500).json({ message: 'Core initialization failure.' })
  }
}

// ── Shared Routes Mounting ─────────────────────────────────────────────────────
const apiRouter = express.Router()
// Health Check
apiRouter.get('/health', (req, res) => res.json({ status: 'Elite Server Online 💎' }))

// Protected & Open Routes
apiRouter.use('/auth', ensureDB, authRoutes)
apiRouter.use('/products', ensureDB, productRoutes)
apiRouter.use('/user', ensureDB, userRoutes)
apiRouter.use('/orders', ensureDB, orderRoutes)
apiRouter.use('/reviews', ensureDB, reviewRoutes)
apiRouter.use('/analytics', ensureDB, analyticsRoutes)
apiRouter.use('/payment', ensureDB, paymentRoutes)

// Support both /api/path and /path (for Vercel rewrites)
app.use('/api', apiRouter)
app.use('/', apiRouter)

// ── Diagnostic 404 Handler ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found.', 
    details: {
      url: req.url,
      method: req.method,
      originalUrl: req.originalUrl,
      query: req.query,
      timestamp: new Date().toISOString()
    }
  })
})

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack)
  res.status(err.status || 500).json({ 
    message: err.message || 'Vault access error.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

module.exports = app

// Only start listener if run directly (Local Development)
if (require.main === module || process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  ensureDB({ }, { }, () => {
    app.listen(PORT, () => {
      console.log(`🔥 Elite System Active at http://localhost:${PORT}`)
    })
  })
}
