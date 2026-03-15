require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const User = require('./models/User')

// DNS Fix
dns.setServers(['8.8.8.8', '8.8.4.4'])

async function verify() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const user = await User.findOne({ email: 'hasan@elite.com' })
  if (!user) {
    console.log('❌ User hasan@elite.com NOT found in database!')
  } else {
    console.log('✅ User found:')
    console.log(`   ID: ${user._id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Created At: ${user.createdAt}`)
  }
  
  await mongoose.disconnect()
}

verify().catch(console.error)
