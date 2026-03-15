require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

dns.setServers(['8.8.8.8', '8.8.4.4'])

async function testPassword() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const user = await User.findOne({ email: 'hasan@elite.com' }).select('+passwordHash')
  if (!user) {
    console.log('❌ User not found')
  } else {
    console.log(`✅ User found: ${user.email}`)
    const isMatch = await bcrypt.compare('elite123', user.passwordHash)
    console.log(`🔑 Password "elite123" match: ${isMatch}`)
    console.log(`📝 Hash in DB: ${user.passwordHash}`)
  }
  
  await mongoose.disconnect()
}

testPassword().catch(console.error)
