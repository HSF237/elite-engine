import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart()
  const { isLiked, toggleWishlist } = useWishlist()
  if (!product) return null

  const price = product.discountPrice ?? product.regularPrice ?? product.price ?? 0
  const liked = isLiked(product.id)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.retailHeading ?? product.name,
      price,
      image: product.images?.[0],
      size: product.sizes?.[0] ?? 'One Size',
      color: product.colors?.[0]?.name ?? 'Default',
    })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-strong rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="md:w-1/2 aspect-square md:aspect-auto md:min-h-[420px] bg-white/5 relative">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.retailHeading ?? product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 font-jakarta">
                No image
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="md:w-1/2 p-8 flex flex-col">
            <h2 className="font-outfit font-bold text-2xl text-white">
              {product.retailHeading ?? product.name}
            </h2>
            <p className="text-[#c9a962] font-outfit font-semibold text-xl mt-2">
              ₹{(price).toLocaleString()}
              {product.regularPrice && product.discountPrice && (
                <span className="text-white/50 line-through text-base ml-2">
                  ₹{product.regularPrice.toLocaleString()}
                </span>
              )}
            </p>
            {product.longDescription && (
              <p className="font-jakarta text-white/70 text-sm mt-4 line-clamp-4">
                {product.longDescription}
              </p>
            )}
            {product.colors?.length > 0 && (
              <div className="mt-4">
                <p className="text-white/60 text-xs font-jakarta uppercase tracking-wider mb-2">Colours</p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <div
                      key={c.hex ?? c.name}
                      className="w-8 h-8 rounded-full border-2 border-white/30 shadow-inner"
                      style={{ backgroundColor: c.hex ?? '#888' }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="mt-4">
                <p className="text-white/60 text-xs font-jakarta uppercase tracking-wider mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="px-4 py-2 rounded-lg border border-white/20 text-sm font-jakarta hover:bg-white/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-auto pt-8 flex gap-3">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-lg bg-[#c9a962] text-black font-outfit font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </motion.button>
              <motion.button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="w-12 h-12 rounded-lg border border-white/20 flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div animate={{ scale: liked ? 1.2 : 1 }}>
                  <Heart
                    className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white/70'}`}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
