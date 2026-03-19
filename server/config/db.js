const mongoose = require('mongoose')
const dns = require('dns')

// Fix for ECONNREFUSED on some networks (like Jio) when resolving SRV records
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI
  if (!uri) throw new Error('Database connection string (MONGODB_URI) is missing.')
  
  try {
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`)
    throw err // Throw to be caught by the middleware
  }
}

module.exports = connectDB
