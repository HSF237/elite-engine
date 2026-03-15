import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import QuickViewModal from '../components/QuickViewModal'
import { HERO_SLIDES, CATEGORIES, ELITE_DROPS } from '../data/mockProducts'

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
    api.get('/api/products?limit=6')
      .then(res => {
        setProducts(res.data.products)
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
    <div className="min-h-screen bg-[#0a0a0b]">
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
                  <motion.a
                    href="#elite-drops"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 inline-block px-8 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 font-outfit font-semibold text-white hover:bg-white/25 transition-all"
                  >
                    {slide.cta}
                  </motion.a>
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
              className={`w-2 h-2 rounded-full transition-all ${
                i === heroIndex ? 'bg-[#c9a962] w-6' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ——— Specialized Grid Cards (Amazon style) ——— */}
      <section className="py-12 px-4 sm:px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Under 999 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }}
               className="bg-[#1a1a1c] p-5 rounded-2xl border border-white/5 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all"
            >
               <h3 className="font-outfit font-bold text-xl mb-1 text-white">Under ₹999</h3>
               <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">Daily Essentials</p>
               <div className="grid grid-cols-2 gap-2 flex-1">
                  {['https://images.unsplash.com/photo-1582966271819-75e4871e9b5e?w=200', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200', 'https://images.unsplash.com/photo-1602143399827-70349babc0e7?w=200', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200'].map((img, i) => (
                     <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                  ))}
               </div>
               <a href="#deals" className="mt-4 text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Explore All <ChevronRight className="w-3 h-3" />
               </a>
            </motion.div>

            {/* Card 2: Home Revamp */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-[#1a1a1c] p-5 rounded-2xl border border-white/5 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all"
            >
               <h3 className="font-outfit font-bold text-xl mb-1 text-white">Revamp Home</h3>
               <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">Smart Living</p>
               <div className="grid grid-cols-2 gap-2 flex-1">
                  {['https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=200', 'https://images.unsplash.com/photo-1602872030219-cbf948a98718?w=200', 'https://images.unsplash.com/photo-1584100936595-c0654b55a4e2?w=200', 'https://images.unsplash.com/photo-1594396041774-7264a7c067e4?w=200'].map((img, i) => (
                     <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                        <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                  ))}
               </div>
               <a href="#home" className="mt-4 text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Shop Now <ChevronRight className="w-3 h-3" />
               </a>
            </motion.div>

            {/* Card 3: Trending Now */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-[#1a1a1c] p-5 rounded-2xl border border-white/5 flex flex-col group cursor-pointer hover:border-[#c9a962]/30 transition-all"
            >
               <h3 className="font-outfit font-bold text-xl mb-1 text-white">Trending Now</h3>
               <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">Style Guide</p>
               <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5 flex-1">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <span className="text-[10px] font-bold text-[#c9a962]">UP TO 60% OFF</span>
                  </div>
               </div>
               <a href="#fashion" className="text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em] hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View Collection <ChevronRight className="w-3 h-3" />
               </a>
            </motion.div>

            {/* Card 4: Sign in / Personalization */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="bg-gradient-to-br from-[#c9a962] to-[#b09452] p-6 rounded-2xl flex flex-col shrink-0"
            >
               <h3 className="font-outfit font-black text-2xl text-black leading-tight mb-2">Personalized For You</h3>
               <p className="text-sm text-black/70 mb-6 font-semibold">Get recommendations based on your unique style.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black/80 transition-all shadow-xl shadow-black/20 mt-auto"
                >
                   Sign In Securely
                </button>
                <Link to="/signup" className="mt-4 text-[10px] font-black text-black/50 text-center uppercase tracking-widest hover:text-black transition-colors">
                   New? Start Here
                </Link>
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

      {/* ——— Category Bubbles ——— */}
      <section id="categories" className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-outfit font-bold text-2xl sm:text-3xl text-center text-white mb-12"
          >
            Shop by Category
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 sm:gap-8"
          >
            {CATEGORIES.map((cat) => (
              <motion.a
                key={cat.id}
                href={cat.slug}
                variants={item}
                className="group flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-white/5 backdrop-blur-sm group-hover:border-[#c9a962]/50 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="font-jakarta font-medium text-white/90 mt-3 group-hover:text-[#c9a962] transition-colors">
                  {cat.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ——— Elite Drops ——— */}
      <section id="elite-drops" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="font-jakarta text-[#c9a962] text-sm uppercase tracking-[0.25em] mb-2">
              Curated for you
            </p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl text-white">
              Elite Drops
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              // Skeleton Loader
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-4" />
                  <div className="h-6 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-white/5 rounded w-1/4" />
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => {
                const price = product.discountPrice ?? product.regularPrice ?? 0
                const liked = isLiked(product._id || product.id)
                return (
                  <motion.article
                    key={product._id || product.id}
                    variants={item}
                    className="group relative"
                  >
                    <div
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x533?text=No+Image'}
                        alt={product.retailHeading}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {product.sizes?.length > 0 && (
                          <p className="font-jakarta text-xs text-white/80 mb-1">
                            Sizes: {product.sizes.join(', ')}
                          </p>
                        )}
                        <div className="flex gap-2 text-white/40 text-[10px] uppercase font-bold">
                          {product.category || 'Elite Product'}
                        </div>
                      </div>
                      <motion.button
                        type="button"
                        aria-label="Add to wishlist"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product._id || product.id)
                        }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-opacity"
                        whileTap={{ scale: 0.85 }}
                      >
                        <motion.div
                          animate={{ scale: liked ? 1.2 : 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Heart
                            className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white/90'}`}
                          />
                        </motion.div>
                      </motion.button>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-outfit font-semibold text-lg text-white group-hover:text-[#c9a962] transition-colors line-clamp-1">
                        {product.retailHeading}
                      </h3>
                      <p className="font-jakarta text-[#c9a962] font-semibold mt-1">
                        ₹{price.toLocaleString()}
                        {product.regularPrice && product.discountPrice && product.regularPrice > product.discountPrice && (
                          <span className="text-white/50 line-through text-sm ml-2">
                            ₹{product.regularPrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuickViewProduct(product)
                        }}
                        className="font-jakarta text-sm text-white/70 hover:text-white mt-1 underline underline-offset-2"
                      >
                        Quick View
                      </button>
                    </div>
                  </motion.article>
                )
              })
            ) : (
              <div className="col-span-full py-20 text-center border border-white/5 rounded-3xl bg-white/[0.02]">
                <p className="text-white/40 font-jakarta">No products found. Start adding products from the staff dashboard!</p>
              </div>
            )}
          </motion.div>
        </div>
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
