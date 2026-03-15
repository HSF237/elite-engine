const mongoose = require('mongoose')
const dns = require('dns')

// Fix for ECONNREFUSED on some networks (like Jio) when resolving SRV records
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
