module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'Elite Systems Operable 🟢', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  })
}
