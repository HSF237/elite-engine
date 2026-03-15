import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import QuickViewModal from '../components/QuickViewModal'
import { HERO_SLIDES, CATEGORIES, ELITE_DROPS } from '../data/mockProducts'
import { getRecentlyViewed } from '../utils/recentViewed'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

import api from '../utils/api'

const FlashDealCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 })
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <div className="flex gap-2 text-white font-black text-xl">
      <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 w-12 text-center">{timeLeft.h}</div>
      <span className="text-[#c9a962]">:</span>
      <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 w-12 text-center">{timeLeft.m}</div>
      <span className="text-[#c9a962]">:</span>
      <div className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 w-12 text-center">{timeLeft.s}</div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [heroIndex, setHeroIndex] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const { addToCart } = useCart()
  const { isLiked, toggleWishlist } = useWishlist()

  // Fetch live products
  useEffect(() => {
    api.get('/api/products?limit=5')
      .then(res => {
        setProducts(res.data.products?.length > 0 ? res.data.products : ELITE_DROPS.slice(0, 5))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  // Hero auto-play
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0b] overflow-x-hidden">
      {/* Premium Notification Bar */}
      <div className="bg-gradient-to-r from-[#c9a962] to-[#b09452] text-black py-2 px-4 overflow-hidden hidden sm:block">
        <motion.div
          animate={{ x: [1000, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex gap-12 font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <span>✨ Flash Sale Live: Up to 70% Off Elite Tech</span>
          <span>🚀 Free Express Shipping on all orders above ₹4,999</span>
          <span>💎 New Membership Program Launched: Join Elite Club Now</span>
          <span>⚡ Next Drop: Phantom Watch V2 in 04:12:00</span>
        </motion.div>
      </div>
      {/* ——— Hero Slider ——— */}
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        <AnimatePresence mode="wait">
          {HERO_SLIDES.map((slide, i) =>
            i === heroIndex ? (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="font-jakarta text-white/80 text-sm uppercase tracking-[0.3em] mb-2"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="font-outfit font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-8 inline-block px-8 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-outfit font-semibold text-white hover:bg-white/25 transition-all"
                  >
                    {slide.cta}
                  </button>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setHeroIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setHeroIndex((i) => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setHeroIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIndex ? 'bg-[#c9a962] w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </section>

      {/* ——— Specialized Grid Cards (Amazon style) ——— */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Under 999 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1c] p-6 rounded-[2.5rem] border border-white/5 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all shadow-2xl relative overflow-hidden"
            onClick={() => navigate('/shop?filter=deals')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a962]/10 blur-3xl -mr-16 -mt-16" />
            <h3 className="font-outfit font-black text-lg sm:text-2xl mb-1 text-white uppercase tracking-tighter">Under ₹999</h3>
            <p className="text-[8px] sm:text-[10px] text-[#c9a962] mb-4 font-black uppercase tracking-[0.2em]">Curated Essentials</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
              {[
                'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRYTxsxwGjTDJT5M4NejgVnCN9Ewqg1XRgrwTLuXVZ_yyofgd2IrgYz-58iPLjWZGMHxAXWHYqMOC52-7h4QD2eV-Ou0YVGhfh7rm0h-GyQhLvnFMV9EY4IGQ',
                'https://images.unsplash.com/photo-1691256676359-20e5c6d4bc92?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FwfGVufDB8fDB8fHww',
                'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              ].map((img, i) => (
                <div key={i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                  <img
                    src={`${img}?auto=format&fit=crop&w=300&q=80`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em]">Explore All</span>
              <ChevronRight className="w-4 h-4 text-[#c9a962] group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: Home Revamp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1c] p-6 rounded-[2.5rem] border border-white/5 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all shadow-2xl"
            onClick={() => navigate('/shop?category=Home')}
          >
            <h3 className="font-outfit font-black text-lg sm:text-2xl mb-1 text-white uppercase tracking-tighter">Elite Spaces</h3>
            <p className="text-[8px] sm:text-[10px] text-[#c9a962] mb-4 font-black uppercase tracking-[0.2em]">Smart Interior</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
              {[
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
                'https://images.unsplash.com/photo-1513694203232-719a280e022f',
                'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
                'https://images.unsplash.com/photo-1558882224-cca162730a91'
              ].map((img, i) => (
                <div key={i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                  <img
                    src={`${img}?auto=format&fit=crop&w=300&q=80`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?w=300' }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em]">View Designs</span>
              <ChevronRight className="w-4 h-4 text-[#c9a962] group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: Trending Now - Interactive Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a1c] p-6 rounded-[2.5rem] border border-white/10 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h3 className="font-outfit font-black text-lg sm:text-2xl mb-1 text-white uppercase tracking-tighter">Flash Deal</h3>
            <p className="text-[8px] sm:text-red-500 mb-6 font-black uppercase tracking-[0.2em] text-red-500">Ends In:</p>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <FlashDealCountdown />
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?w=400" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-black text-[10px] uppercase tracking-widest bg-[#c9a962]/40 backdrop-blur-md px-4 py-2 rounded-full">Save 70%</span>
                </div>
              </div>
            </div>
            <Link to="/shop?filter=deals" className="mt-8 text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center gap-1 self-center">
              Unlock Deals <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.div>

          {/* Card 4: Sign in / Personalization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#c9a962] to-[#b09452] p-8 rounded-[2.5rem] flex flex-col justify-between"
          >
            <div>
              <h3 className="font-outfit font-black text-xl sm:text-3xl text-black leading-none mb-3 uppercase tracking-tighter">Your Elite Profile</h3>
              <p className="text-[10px] sm:text-xs text-black/70 font-bold uppercase tracking-wide">Sign in for exclusive drops and faster checkout.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/20"
              >
                Sign In Securely
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-white/20 backdrop-blur-md text-black border border-black/10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all"
              >
                New Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— Big Value Banner ——— */}
      <section className="py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" alt="" className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent flex flex-col justify-center px-8 sm:px-16">
            <span className="text-[#c9a962] font-black tracking-[0.3em] text-sm uppercase mb-4">Midnight Sale</span>
            <h2 className="text-4xl sm:text-6xl font-outfit font-black text-white max-w-lg leading-none mb-6">UNSTOPPABLE DEALS STARTING NOW</h2>
            <button
              onClick={() => navigate('/shop')}
              className="bg-white text-black font-black px-10 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-[#c9a962] transition-colors self-start shadow-2xl"
            >
              Grab The Offer
            </button>
          </div>
        </div>
      </section>

      {/* ——— Elite Drops Product Grid ——— */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-outfit font-black text-3xl sm:text-4xl text-white uppercase tracking-tighter">Elite Drops</h2>
              <p className="text-[10px] text-[#c9a962] font-black tracking-[0.4em] uppercase mt-2">Newest arrivals in the marketplace</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse" />
              ))
            ) : (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  layoutId={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 group-hover:border-[#c9a962]/30 transition-all relative">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                      alt={product.retailHeading} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="text-[10px] font-black text-[#c9a962] uppercase tracking-widest mb-1">{product.category}</p>
                      <h4 className="text-white font-bold truncate text-sm mb-2">{product.retailHeading}</h4>
                      <p className="text-white/80 font-black text-xs">₹{product.discountPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-16 flex justify-center">
             <button 
                onClick={() => navigate('/shop')}
                className="group relative px-12 py-5 bg-[#c9a962] rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#c9a962]/20"
             >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative font-outfit font-black text-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                   Explore Full Marketplace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
             </button>
          </div>
        </div>
      </section>

      {/* ——— Recently Viewed Section ——— */}
      {getRecentlyViewed().length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-outfit font-black text-3xl text-white uppercase tracking-tighter">Recently Viewed</h2>
                <p className="text-[10px] text-[#c9a962] font-black tracking-[0.4em] uppercase mt-2">Pick up right where you left off</p>
              </div>
              <button
                onClick={() => localStorage.removeItem('elite_recently_viewed')}
                className="text-[10px] font-black uppercase text-white/20 hover:text-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {getRecentlyViewed().map((product, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/5 group-hover:border-[#c9a962]/30 transition-all relative">
                    <img src={product.images?.[0] || product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="text-[10px] font-black text-[#c9a962] uppercase tracking-widest mb-1">Quick Revisit</p>
                      <h4 className="text-white font-bold truncate text-sm">{product.name || product.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Promotional Shop All Call-to-Action ——— */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a962]/50 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-outfit font-black text-4xl sm:text-5xl text-white mb-6 uppercase tracking-tighter">Ready to Upgrade?</h2>
          <p className="text-white/40 mb-10 max-w-lg mx-auto font-medium">Browse our full collection of premium tech, fashion, and lifestyle essentials.</p>
          <button
            onClick={() => navigate('/shop')}
            className="group px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.2em] hover:bg-[#c9a962] hover:text-black hover:border-[#c9a962] transition-all shadow-2xl"
          >
            Explore Marketplace
          </button>
        </motion.div>
      </section>

      {/* ——— Elite Trust Section ——— */}
      <section className="py-20 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Elite Quality', desc: 'Hand-picked luxury items vetted by global experts.', icon: '💎' },
            { title: 'Secure Vault', desc: 'Encrypted end-to-end payments with 24/7 fraud protection.', icon: '🛡️' },
            { title: 'Priority Drop', desc: 'Fastest delivery engine in the luxury segment.', icon: '🚀' },
          ].map((trust, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-4">{trust.icon}</div>
              <h4 className="font-outfit font-bold text-lg text-white mb-2">{trust.title}</h4>
              <p className="text-sm text-white/50 leading-relaxed font-medium">{trust.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— Quick View Modal ——— */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
