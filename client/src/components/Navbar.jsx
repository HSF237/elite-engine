import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, Search, Heart, User, ChevronDown, MapPin, LogOut, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Shop All', href: '/shop', isRoute: true },
  { label: "Today's Deals", href: '/shop?filter=deals', isRoute: true },
  { label: 'Footwear', href: '/shop?category=Footwear', isRoute: true },
  { label: 'Apparel', href: '/shop?category=Apparel', isRoute: true },
  { label: 'Electronics', href: '/shop?category=Electronics', isRoute: true },
  { label: 'Beauty', href: '/shop?category=Beauty', isRoute: true },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { openCart, count } = useCart()
  const { count: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0a0a0b]/95 backdrop-blur-2xl px-4 ${
        scrolled ? 'border-b border-white/10' : 'border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Main Navigation Row */}
        <div className="flex items-center gap-6 h-14 sm:h-16">
          {/* Section 1: Brand & Identity */}
          <div className="flex items-center gap-4 shrink-0">
             <Link to="/" className="font-outfit font-black text-xl sm:text-2xl tracking-tighter text-white flex items-center gap-2 group">
               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#c9a962] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-[#c9a962]/20">
                  <ShoppingBag className="w-5 h-5 text-black" />
               </div>
               <span className="hidden sm:inline">ELITE<span className="text-[#c9a962]">STORE</span></span>
             </Link>

             {/* Location Pulse (Desktop Only) */}
             <div className="hidden lg:flex items-center gap-2 text-white/50 hover:text-white cursor-pointer transition-all px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 group">
                <MapPin className="w-4 h-4 group-hover:text-[#c9a962] transition-colors" />
                <div className="flex flex-col">
                   <span className="text-[8px] uppercase tracking-widest font-black leading-none opacity-50">Pulse</span>
                   <span className="text-xs font-bold leading-none mt-1">India</span>
                </div>
             </div>
          </div>

          {/* Section 2: Smart Search Architecture */}
          <div className="flex-1 flex justify-center max-w-2xl px-2">
             <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`)
                }}
                className="w-full flex rounded-xl overflow-hidden glass border border-white/10 focus-within:ring-2 focus-within:ring-[#c9a962]/30 transition-all h-10 group"
             >
                <div className="flex items-center pl-4 pr-2 text-white/20 group-focus-within:text-[#c9a962]">
                   <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="Elite Search Protocol..."
                  className="flex-1 bg-transparent px-2 text-xs font-medium text-white focus:outline-none placeholder:text-white/20"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-[#c9a962] px-5 flex items-center justify-center hover:bg-[#b59858] transition-colors">
                   <Search className="w-4 h-4 text-black" />
                </button>
             </form>
          </div>

          {/* Section 3: User Commands & Bag */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
             <Link to="/wishlist" className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all group">
               <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'text-white/40 group-hover:text-red-400'}`} />
               {wishlistCount > 0 && <span className="absolute top-2 right-2 min-w-[14px] h-[14px] rounded-full bg-red-500 text-[8px] font-black flex items-center justify-center">{wishlistCount}</span>}
             </Link>
             
             <button onClick={openCart} className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all group">
               <ShoppingBag className="w-5 h-5 text-white/40 group-hover:text-[#c9a962]" />
               {count > 0 && <span className="absolute top-2 right-2 min-w-[14px] h-[14px] rounded-full bg-[#c9a962] text-[8px] font-black text-black flex items-center justify-center">{count}</span>}
             </button>

             <div className="h-6 w-px bg-white/5 mx-1 hidden sm:block" />

             {user ? (
               <Link to="/profile" className="flex items-center gap-2 group p-1 sm:p-1.5 rounded-xl hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-[#c9a962] flex items-center justify-center font-black text-xs text-black uppercase shadow-lg shadow-[#c9a962]/10">{user.name?.[0]}</div>
                  <div className="hidden md:flex flex-col items-start pr-2">
                     <span className="text-[10px] font-black text-white/40 uppercase leading-none italic">{user.role === 'admin' ? 'Architect' : 'Member'}</span>
                     <span className="text-xs font-bold text-white leading-none mt-1">{user.name?.split(' ')[0]}</span>
                  </div>
               </Link>
             ) : (
               <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                 <User className="w-4 h-4 text-white/40 group-hover:text-[#c9a962]" />
                 <span className="hidden md:inline text-[10px] font-black text-white uppercase tracking-widest">Entry</span>
               </Link>
             )}

             <button onClick={() => setMobileOpen(true)} className="sm:hidden p-2.5 text-white/40 hover:text-white">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Category Command Bar */}
        <div className="flex items-center gap-4 py-2 border-t border-white/5 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setMobileOpen(true)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black text-[#c9a962] hover:bg-[#c9a962]/10 uppercase tracking-widest transition-all shrink-0"
           >
              <Menu className="w-3.5 h-3.5" /> ALL
           </button>
           
           <div className="flex items-center gap-1 sm:gap-2">
             {NAV_LINKS.map(link => (
                <Link 
                  key={link.label} 
                  to={link.href} 
                  className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all shrink-0 px-4 py-1.5 rounded-lg border border-transparent ${
                    link.label === 'Shop All' 
                      ? 'bg-[#c9a962] text-black shadow-lg shadow-[#c9a962]/10' 
                      : 'text-white/40 hover:text-white hover:bg-white/5 hover:border-white/5'
                  }`}
                >
                  {link.label}
                </Link>
             ))}
           </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
               onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-[#0a0a0b] z-[70] shadow-2xl p-6 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                 <span className="font-outfit font-black text-xl text-white">ELITE <span className="text-[#c9a962]">MENU</span></span>
                 <button onClick={() => setMobileOpen(false)} className="p-2 glass rounded-full text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex flex-col gap-1 mt-4">
                 {NAV_LINKS.map(link => (
                   <Link 
                     key={link.label} 
                     to={link.href} 
                     onClick={() => setMobileOpen(false)}
                     className="text-lg font-black uppercase tracking-tighter text-white/40 hover:text-[#c9a962] hover:pl-2 transition-all py-3 border-b border-white/5"
                   >
                     {link.label}
                   </Link>
                 ))}
              </div>

              {user ? (
                 <button 
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="mt-auto w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                   <LogOut className="w-4 h-4" /> End Session
                </button>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-auto w-full py-4 bg-[#c9a962] text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                   <User className="w-4 h-4" /> Authorized Entry
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
