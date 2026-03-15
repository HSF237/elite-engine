const fs = require('fs');
const path = require('path');

const categories = ['Footwear', 'Apparel', 'Electronics', 'Beauty', 'Accessories', 'Home'];
const terms = {
  'Footwear': ['sneakers', 'boots', 'shoes', 'running', 'luxury'],
  'Apparel': ['hoodie', 'jacket', 'shirt', 'trousers', 'designer'],
  'Electronics': ['smartphone', 'headphones', 'smartwatch', 'laptop', 'camera'],
  'Beauty': ['perfume', 'skincare', 'cosmetics', 'facial', 'essence'],
  'Accessories': ['watch', 'sunglasses', 'belt', 'wallet', 'jewelry'],
  'Home': ['sofa', 'lamp', 'interior', 'minimalist', 'decor']
};

const images = {
  'Footwear': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
    'https://images.unsplash.com/photo-1512374382149-433a887a234e'
  ],
  'Apparel': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    'https://images.unsplash.com/photo-1576566582417-4348421de730',
    'https://images.unsplash.com/photo-1564557287817-3785e3c77f53'
  ],
  'Electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48',
    'https://images.unsplash.com/photo-1583394838336-acd9929a3361',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1522335789183-be0e47b28db1',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    'https://images.unsplash.com/photo-1596462502278-27ec8203091c',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7'
  ],
  'Home': [
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
    'https://images.unsplash.com/photo-1558882224-cca162730a91'
  ]
};

const products = [];
for (let i = 1; i <= 50; i++) {
  const cat = categories[i % categories.length];
  const termList = terms[cat];
  const term = termList[i % termList.length];
  const price = Math.floor(Math.random() * 40000) + 5000;
  
  const catImages = images[cat];
  const imgUrl = catImages[i % catImages.length] + '?auto=format&fit=crop&q=80&w=800';

  products.push({
    retailHeading: 'Elite ' + term.charAt(0).toUpperCase() + term.slice(1) + ' ' + (100 + i),
    longDescription: 'Premium ' + cat + ' asset with bespoke architectural design and sustainable materials. Engineered for the elite lifestyle.',
    regularPrice: price,
    discountPrice: Math.floor(price * 0.85),
    category: cat,
    department: cat,
    images: [imgUrl],
    deliveryCharge: 0,
    sizes: cat === 'Footwear' ? ['8', '9', '10', '11'] : (cat === 'Apparel' ? ['S', 'M', 'L', 'XL'] : ['One Size']),
    inStock: true
  });
}

const seedFileContent = \`require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
const Product = require('./models/Product')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const PRODUCTS = \${JSON.stringify(products, null, 2)}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    console.log('🧹 Clearing existing products...')
    await Product.deleteMany({})

    for (const product of PRODUCTS) {
      await Product.create(product)
      console.log(\\\`🚀 Created: \\\${product.retailHeading}\\\`)
    }

    console.log('🎉 Seeding Complete! 50 Elite products are now live.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
\`;

fs.writeFileSync(path.join('c:', 'Users', 'HI', 'Desktop', 'elite-engine', 'server', 'seedProducts.js'), seedFileContent);
console.log('✅ Generated seedProducts.js');
