// Mock data for hero slider and Elite Drops — replace with API later
export const HERO_SLIDES = [
  {
    id: 'h1',
    image: '/hero-science-lab-ai.jpg',
    title: 'SCIENCE IN MOTION',
    subtitle: 'DISCOVER OUR PREMIUM APPAREL',
    cta: 'Explore Collection',
    accent: '#c9a962'
  },
  {
    id: 'h2',
    image: '/brain/68f1a24e-8bb6-4277-8f1b-ab5682b204a7/elite_category_fashion_avantgarde_1773571232065.png',
    title: 'AVANT-GARDE STYLE',
    subtitle: 'STREET LUXURY EVOLVED',
    cta: 'Shop Apparel',
    accent: '#1a1a1a'
  }
]

export const CATEGORIES = [
  { id: 'footwear', label: 'Footwear', slug: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' },
  { id: 'apparel', label: 'Apparel', slug: 'Apparel', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800' },
  { id: 'electronics', label: 'Electronics', slug: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800' },
  { id: 'beauty', label: 'Beauty', slug: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789183-be0e47b28db1?auto=format&fit=crop&q=80&w=800' },
  { id: 'home', label: 'Home', slug: 'Home', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=800' },
]

export const ELITE_DROPS = [
  {
    id: 'p1',
    retailHeading: 'Phantom Precision Sneakers',
    longDescription: 'High-performance luxury sneakers with carbon-fiber weave and reactive cushioning.',
    regularPrice: 24999,
    discountPrice: 18999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    sizes: ['8', '9', '10', '11'],
    colors: [{ name: 'Onyx', hex: '#0a0a0a' }, { name: 'Titanium', hex: '#d1d5db' }],
    department: 'Footwear',
    deliveryCharge: 0,
    rating: 4.9,
    reviews: 1240,
  },
  {
    id: 'p2',
    retailHeading: 'Signature Quartz Audio',
    longDescription: 'Bespoke crystal-clear sound with genuine leather finish and active noise isolation.',
    regularPrice: 34999,
    discountPrice: 29999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    sizes: ['One Size'],
    colors: [{ name: 'Silver', hex: '#c0c0c0' }, { name: 'Space Grey', hex: '#2f2f2f' }],
    department: 'Electronics',
    deliveryCharge: 0,
    rating: 4.9,
    reviews: 850,
  },
  {
    id: 'p3',
    retailHeading: 'Elite Monarch Timepiece',
    longDescription: 'Precision movement housed in a surgical-grade steel casing with sapphire glass.',
    regularPrice: 42000,
    discountPrice: 38500,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
    sizes: ['One Size'],
    colors: [{ name: 'Gold', hex: '#c9a962' }, { name: 'Steel', hex: '#d1d5db' }],
    department: 'Accessories',
    deliveryCharge: 0,
    rating: 5.0,
    reviews: 42,
  },
  {
    id: 'p4',
    retailHeading: 'Aura Avant-Garde Hoodie',
    longDescription: 'Ultra-heavyweight 500GSM cotton with a sculptural silhouette and silk lining.',
    regularPrice: 12500,
    discountPrice: 8999,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Midnight', hex: '#0a0a0a' }, { name: 'Iron', hex: '#374151' }],
    department: 'Apparel',
    deliveryCharge: 0,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 'p5',
    retailHeading: 'Precision Frame Optics',
    longDescription: 'Hand-crafted acetate frames with polarized lenses and signature gold accents.',
    regularPrice: 18000,
    discountPrice: 14500,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'],
    sizes: ['Standard'],
    colors: [{ name: 'Black Gold', hex: '#1a1a1a' }],
    department: 'Accessories',
    deliveryCharge: 0,
    rating: 4.8,
    reviews: 512,
  },
  {
    id: 'p6',
    retailHeading: 'Leather Crossbody Pulse',
    longDescription: 'Minimalist carry tailored for the modern nomad. Waterproof leather.',
    regularPrice: 15999,
    discountPrice: 12499,
    images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800'],
    sizes: ['One Size'],
    colors: [{ name: 'Tan', hex: '#c4a574' }, { name: 'Black', hex: '#0a0a0a' }],
    department: 'Accessories',
    deliveryCharge: 0,
    rating: 4.6,
    reviews: 88,
  },
]

export const COLLECTIONS = [
  {
    id: 'c1',
    title: 'Under ₹999',
    subtitle: 'Daily Essentials',
    items: [
      { id: 'i1', name: 'Elite Socks', price: 499, image: 'https://images.unsplash.com/photo-1582966271819-75e4871e9b5e?w=200' },
      { id: 'i2', name: 'Cotton Cap', price: 799, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200' },
      { id: 'i3', name: 'Water Bottle', price: 899, image: 'https://images.unsplash.com/photo-1602143399827-70349babc0e7?w=200' },
      { id: 'i4', name: 'Note Book', price: 599, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200' },
    ]
  },
  {
    id: 'c2',
    title: 'Home Revamp',
    subtitle: 'Smart Living',
    items: [
      { id: 'i5', name: 'Glass Vase', price: 1299, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200' },
      { id: 'i6', name: 'Candle Holder', price: 899, image: 'https://images.unsplash.com/photo-1602872030219-cbf948a98718?w=200' },
      { id: 'i7', name: 'Linen Pillow', price: 1599, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a4e2?w=200' },
      { id: 'i8', name: 'Woven Basket', price: 999, image: 'https://images.unsplash.com/photo-1594396041774-7264a7c067e4?w=200' },
    ]
  }
]
