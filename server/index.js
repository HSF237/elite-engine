require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')
const reviewRoutes = require('./routes/reviews')
const analyticsRoutes = require('./routes/analytics')

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Unified API Router ────────────────────────────────────────────────────────
const apiRouter = express.Router()

// Health Check
apiRouter.get('/health', (req, res) => res.json({ status: 'Elite Server is running 🚀' }))

// Attach specific routes (all without /api prefix internally)
apiRouter.use('/auth', authRoutes)
apiRouter.use('/products', productRoutes)
apiRouter.use('/user', userRoutes)
apiRouter.use('/orders', orderRoutes)
apiRouter.use('/reviews', reviewRoutes)
apiRouter.use('/analytics', analyticsRoutes)

// Mount the router on both /api (standard) and / (Vercel re-based cases)
app.use('/api', apiRouter)
app.use('/', apiRouter)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  // Only respond with JSON if it's an API attempt or explicitly for routes we know
  res.status(404).json({ 
    message: 'Route not found.', 
    path: req.originalUrl,
    method: req.method
  })
})

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

module.exports = app
if (process.env.NODE_ENV !== 'production' || require.main === module) {
  const PORT = process.env.PORT || 5000
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Elite Server running on http://localhost:${PORT}`)
    })
  })
}
