require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'Elite Server is running 🚀' }))

// ── Routes ────────────────────────────────────────────────────────────────────
const userRoutes = require('./routes/user')

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/orders', orderRoutes)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🔥 Elite Server running on http://localhost:${PORT}`)
  })
})
