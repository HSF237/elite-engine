require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const Product = require('./models/Product')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const ELITE_DROPS = [
  {
    retailHeading: 'Phantom Precision V1',
    longDescription: 'Bespoke carbon-fiber lifestyle sneakers with adaptive kinetic cushioning.',
    regularPrice: 18499,
    discountPrice: 16999,
    category: 'Footwear',
    department: 'Footwear',
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'],
    deliveryCharge: 0,
    sizes: ['7', '8', '9', '10'],
    inStock: true
  },
  {
    retailHeading: 'Ghost Quartz Audio',
    longDescription: 'Pure crystal resonance headphones with active vacuum tube amplification.',
    regularPrice: 42999,
    discountPrice: 39999,
    category: 'Electronics',
    department: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
    deliveryCharge: 0,
    inStock: true
  },
  {
    retailHeading: 'Apex Night Vision',
    longDescription: 'Military-grade digital optics for the modern urban explorer.',
    regularPrice: 24999,
    discountPrice: 22499,
    category: 'Electronics',
    department: 'Electronics',
    images: ['https://images.unsplash.com/photo-1511367461989-f85a21fda167'],
    deliveryCharge: 0,
    inStock: true
  },
  {
    retailHeading: 'Titanium Nomad Lite',
    longDescription: 'Ultra-lightweight aerospace titanium portable charging core.',
    regularPrice: 8999,
    discountPrice: 7999,
    category: 'Electronics',
    department: 'Electronics',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9'],
    deliveryCharge: 0,
    inStock: true
  },
  {
    retailHeading: 'Elite Signature Hoodie',
    longDescription: 'Hand-woven heavy-gauge cotton with reinforced tactical stitching.',
    regularPrice: 4999,
    discountPrice: 4499,
    category: 'Apparel',
    department: 'Apparel',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'],
    deliveryCharge: 0,
    inStock: true
  },
  {
    retailHeading: 'Phantom Precision V2 (White)',
    longDescription: 'The next evolution of the Phantom line in a minimalist ivory finish.',
    regularPrice: 19499,
    discountPrice: 17999,
    category: 'Footwear',
    department: 'Footwear',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86'],
    deliveryCharge: 0,
    inStock: true
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    for (const product of ELITE_DROPS) {
      const existing = await Product.findOne({ retailHeading: product.retailHeading })
      if (!existing) {
        await Product.create(product)
        console.log(`🚀 Created: ${product.retailHeading}`)
      } else {
        console.log(`ℹ️  Skipped: ${product.retailHeading} (exists)`)
      }
    }

    console.log('🎉 Seeding Complete! Elite products are now live.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
