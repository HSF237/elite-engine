/**
 * Run this ONCE to create your first admin account:
 *   node seed.js
 *
 * This creates the account: hasan@elite.com / elite123
 * Then you can log in at /staff-gateway
 */
require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

// Fix for ECONNREFUSED on some networks
dns.setServers(['8.8.8.8', '8.8.4.4'])

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB')

  const existing = await User.findOne({ email: 'hasan@elite.com' })
  if (existing) {
    console.log('ℹ️  Admin already exists — updating role to admin just in case...')
    await User.updateOne({ email: 'hasan@elite.com' }, { role: 'admin' })
    await mongoose.disconnect()
    return
  }

  const passwordHash = await bcrypt.hash('elite123', 12)
  await User.create({
    name: 'Muhammad Hasan',
    email: 'hasan@elite.com',
    passwordHash,
    role: 'admin',
  })

  console.log('🎉 Admin created!')
  console.log('   Email: hasan@elite.com')
  console.log('   Password: elite123')
  console.log('   Role: admin')
  console.log('\nNow go to: http://localhost:5173/staff-gateway')
  await mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
