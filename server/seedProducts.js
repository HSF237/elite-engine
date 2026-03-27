require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const Product = require('./models/Product')
const User = require('./models/User')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const categories = ['Footwear', 'Apparel', 'Electronics', 'Beauty', 'Accessories', 'Home'];
const terms = {
  'Footwear': ['sneakers', 'boots', 'shoes', 'running', 'luxury', 'derby', 'oxford', 'loafer'],
  'Apparel': ['hoodie', 'jacket', 'shirt', 'trousers', 'designer', 'sweater', 'blazer', 'tee'],
  'Electronics': ['smartphone', 'headphones', 'smartwatch', 'laptop', 'camera', 'monitor', 'tablet'],
  'Beauty': ['perfume', 'skincare', 'cosmetics', 'facial', 'essence', 'serum', 'mist'],
  'Accessories': ['watch', 'sunglasses', 'belt', 'wallet', 'jewelry', 'cufflinks', 'bag'],
  'Home': ['sofa', 'lamp', 'interior', 'minimalist', 'decor', 'planter', 'mirror']
};

const imagesMap = {
  'Footwear': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
    'https://images.unsplash.com/photo-1512374382149-433a887a234e',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842'
  ],
  'Apparel': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    'https://images.unsplash.com/photo-1576566582417-4348421de730',
    'https://images.unsplash.com/photo-1564557287817-3785e3c77f53',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d'
  ],
  'Electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48',
    'https://images.unsplash.com/photo-1583394838336-acd9929a3361',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1522335789183-be0e47b28db1',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    'https://images.unsplash.com/photo-1596462502278-27ec8203091c',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
    'https://images.unsplash.com/photo-1614159102108-2436a5cf8c8b',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa'
  ],
  'Home': [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    'https://images.unsplash.com/photo-1558882224-cca162730a91',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    'https://images.unsplash.com/photo-1493663284031-b7e3aaa4a99f'
  ]
};

const products = [];
for (let i = 1; i <= 100; i++) {
  const cat = categories[i % categories.length];
  const termList = terms[cat];
  const term = termList[i % termList.length];
  const price = Math.floor(Math.random() * 80000) + 2000;
  
  const catImages = imagesMap[cat];
  const imgUrl = catImages[i % catImages.length] + '?auto=format&fit=crop&q=80&w=800';

  products.push({
    retailHeading: 'Elite ' + term.charAt(0).toUpperCase() + term.slice(1) + ' ' + (500 + i),
    longDescription: 'Premium ' + cat + ' product curated for the elite lifestyle. Features sustainable materials and avant-garde design aesthetics.',
    regularPrice: price + Math.floor(price * 0.2),
    discountPrice: price,
    category: cat,
    department: cat,
    images: [imgUrl],
    deliveryCharge: Math.random() < 0.5 ? 0 : 99,
    sizes: cat === 'Footwear' ? ['8', '9', '10', '11'] : (cat === 'Apparel' ? ['S', 'M', 'L', 'XL'] : ['One Size']),
    inStock: true,
    rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
    reviews: Math.floor(Math.random() * 500) + 10,
    ordersCount: Math.floor(Math.random() * 1000) + 5,
    taxRate: 12,
    searchKeywords: ['seeded', cat.toLowerCase()]
  });
}

async function seed() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI missing from .env');

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('✅ Connected to MongoDB')

    // Optional: Get an admin to attach if necessary, but schema doesn't strictly require it for seeding
    const admin = await User.findOne({ role: { $in: ['admin', 'staff'] } });

    console.log('🧹 Clearing existing "seeded" products...')
    await Product.deleteMany({ searchKeywords: 'seeded' })

    console.log(`🚀 Seeding 100 products...`)
    const seededProducts = products.map(p => ({
        ...p,
        createdBy: admin ? admin._id : null
    }));

    await Product.insertMany(seededProducts)

    console.log('🎉 Seeding Complete! 100 Elite products are now live.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()

