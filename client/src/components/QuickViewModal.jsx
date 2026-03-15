import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart()
  const { isLiked, toggleWishlist } = useWishlist()
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const price = product.discountPrice ?? product.regularPrice ?? product.price ?? 0
  const liked = isLiked(product.id)
  const images = product.images?.length ? product.images : ['https://via.placeholder.com/400']
  const discount = product.regularPrice && product.discountPrice
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.retailHeading ?? product.name,
      price,
      image: images[0],
      size: selectedSize ?? product.sizes?.[0] ?? 'One Size',
      color: selectedColor?.name ?? product.colors?.[0]?.name ?? 'Default',
    })
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 1000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#111112] border border-white/10 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black/50"
          onClick={e => e.stopPropagation()}
        >
          {/* ── Left: Image Gallery ── */}
          <div className="md:w-[48%] shrink-0 relative flex flex-col bg-black/20">
            {/* Main Image */}
            <div className="relative aspect-[4/5] md:flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIndex}
                  src={images[imgIndex]}
                  alt={product.retailHeading}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-0 bg-[#c9a962] text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest rounded-r-full">
                  -{discount}% OFF
                </div>
              )}

              {/* Image Prev/Next */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-[#c9a962] hover:text-black transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-[#c9a962] hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-white/20 transition-all z-10">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 bg-black/20 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === imgIndex ? 'border-[#c9a962]' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Details ── */}
          <div className="md:w-[52%] flex flex-col overflow-y-auto no-scrollbar p-6 sm:p-8 gap-5">
            
            {/* Badge + Name */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#c9a962]">{product.department}</span>
              <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white mt-1 leading-tight">
                {product.retailHeading ?? product.name}
              </h2>
            </div>

            {/* Rating Row */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating ?? 4) ? 'fill-[#c9a962] text-[#c9a962]' : 'text-white/10'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{product.rating ?? '4.6'}</span>
              <span className="text-xs text-white/30 font-medium">({product.reviews ?? 248} reviews)</span>
            </div>

            {/* Price Block */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-outfit font-black text-white">₹{price.toLocaleString()}</span>
                {product.regularPrice && product.discountPrice && (
                  <span className="text-base text-white/30 line-through font-medium">₹{product.regularPrice.toLocaleString()}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-black text-green-400 ml-auto">{discount}% off</span>
                )}
              </div>
              <p className="text-[10px] font-black text-[#c9a962] uppercase mt-2 tracking-tighter">
                {product.deliveryCharge === 0 ? '🚀 FREE Priority Elite Delivery' : `+ ₹${product.deliveryCharge} Delivery Charge`}
              </p>
            </div>

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-3">
                  Colour: <span className="text-white">{selectedColor?.name ?? 'Choose'}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map(c => (
                    <button
                      key={c.hex ?? c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor?.name === c.name ? 'border-[#c9a962] scale-110 shadow-lg' : 'border-white/20 hover:border-white/50'}`}
                      style={{ backgroundColor: c.hex ?? '#888' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector (Myntra style) */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                    Size: <span className="text-white">{selectedSize ?? 'Choose'}</span>
                  </p>
                  <button className="text-[9px] font-black uppercase tracking-widest text-[#c9a962] underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] px-3 h-10 rounded-xl border text-xs font-black transition-all ${selectedSize === s ? 'border-[#c9a962] bg-[#c9a962] text-black shadow-lg shadow-[#c9a962]/20' : 'border-white/10 bg-white/5 text-white/60 hover:border-[#c9a962]/50 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.longDescription && (
              <p className="text-sm text-white/50 leading-relaxed font-medium">{product.longDescription}</p>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck className="w-4 h-4" />, label: 'Fast Delivery' },
                { icon: <ShieldCheck className="w-4 h-4" />, label: '100% Genuine' },
                { icon: <RotateCcw className="w-4 h-4" />, label: '7-Day Returns' },
              ].map(badge => (
                <div key={badge.label} className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-[#c9a962]">{badge.icon}</div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-white/40 text-center leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-outfit font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${added ? 'bg-green-500 text-white' : 'bg-[#c9a962] text-black hover:bg-[#b09452]'} shadow-[#c9a962]/20`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingBag className="w-5 h-5" />
                {added ? 'Added! ✓' : 'Add to Bag'}
              </motion.button>

              <motion.button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${liked ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:border-red-400 hover:bg-red-400/10'}`}
                whileTap={{ scale: 0.88 }}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white/60'}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
