import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, Search, Heart, User, ChevronDown, MapPin, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const NAV_LINKS = [
  { label: 'Shop All', href: '/shop', isRoute: true },
  { label: "Today's Deals", href: '/shop?filter=deals', isRoute: true },
  { label: 'Footwear', href: '/shop?category=Footwear', isRoute: true },
  { label: 'Apparel', href: '/shop?category=Apparel', isRoute: true },
  { label: 'Electronics', href: '/shop?category=Electronics', isRoute: true },
  { label: 'Beauty', href: '/shop?category=Beauty', isRoute: true },
]

import { useAuth } from '../context/AuthContext'

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0b]/95 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      {/* Top Main Nav */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-8">
        {/* Logo */}
        <Link to="/" className="font-outfit font-bold text-2xl tracking-tighter text-white shrink-0 flex items-center gap-1 group">
          <div className="w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
             <ShoppingBag className="w-5 h-5 text-black" />
          </div>
          <span>ELITE<span className="text-[#c9a962]">STORE</span></span>
        </Link>

        {/* Deliver to - Amazon style */}
        <div className="hidden xl:flex items-center gap-1 text-white/70 hover:text-white cursor-pointer transition-colors group">
           <MapPin className="w-4 h-4 mt-1 group-hover:text-[#c9a962]" />
           <div className="flex flex-col">
              <span className="text-[10px] leading-none uppercase tracking-tighter">Deliver to</span>
              <span className="text-sm font-bold leading-tight">India</span>
           </div>
        </div>

        {/* PROMINENT SHOP ALL BUTTON - Requested "Upside" */}
        <Link 
          to="/shop" 
          className="order-2 sm:order-none px-4 py-2 bg-[#c9a962] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_0_20px_rgba(201,169,98,0.3)] hover:scale-105 active:scale-95 transition-all hidden md:flex items-center gap-2 whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop All
        </Link>

        {/* Search Bar - Amazon style */}
        <div className="flex-1 w-full max-w-2xl relative order-3 sm:order-none mt-2 sm:mt-0 col-span-full sm:col-span-1">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`)
            }}
            className="flex w-full rounded-xl overflow-hidden glass border border-white/10 group focus-within:ring-2 focus-within:ring-[#c9a962]/50 transition-all"
          >
            <div className="bg-white/5 border-r border-white/10 px-3 flex items-center gap-1 text-xs text-white/60 hover:bg-white/10 cursor-pointer transition-colors">
               All <ChevronDown className="w-3 h-3" />
            </div>
            <input 
              type="text" 
              placeholder="Search Elite Products, Brands and Categories"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-white/30"
            />
            <button type="submit" className="bg-[#c9a962] hover:bg-[#b09452] px-5 flex items-center justify-center transition-colors">
               <Search className="w-5 h-5 text-black" />
            </button>
          </form>
        </div>

        {/* Actions Icons */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto text-white/80 order-2 sm:order-none">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 group p-2 rounded-xl hover:bg-white/5 transition-all">
                 <div className="w-8 h-8 rounded-lg bg-[#c9a962] flex items-center justify-center font-black text-xs text-black uppercase">
                    {user.name?.[0] || 'U'}
                 </div>
                 <span className="hidden md:block text-[10px] uppercase font-black tracking-widest text-white/40 group-hover:text-white transition-colors">Profile</span>
              </Link>
              <button 
                onClick={logout}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex flex-col items-center hover:text-white transition-colors px-2 group">
              <User className="w-5 h-5 group-hover:text-[#c9a962]" />
              <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Sign In</span>
            </Link>
          )}

          <Link to="/shop" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'group-hover:text-red-400'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button onClick={openCart} className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <ShoppingBag className="w-5 h-5 group-hover:text-[#c9a962]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#c9a962] text-[9px] font-bold text-black flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          <button className="sm:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar (Mobile Search goes here) */}

      {/* Bottom Sub Nav - Flipkart/Amazon style */}
      <div className="block bg-black/40 border-t border-white/5 py-2 backdrop-blur-xl w-full text-left overflow-x-auto no-scrollbar">
         <div className="max-w-[1440px] w-max mx-auto px-4 sm:px-6 flex items-center gap-4 sm:gap-8 min-w-max">
            <button 
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 text-[11px] font-black text-white hover:text-[#c9a962] uppercase tracking-[0.15em] transition-all shrink-0 group px-2"
            >
               <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform" /> All Categories
            </button>
            {NAV_LINKS.map(link => (
               link.isRoute
                 ? <Link 
                     key={link.label} 
                     to={link.href} 
                     className={`text-[11px] font-black uppercase tracking-[0.1em] transition-all shrink-0 px-3 py-1.5 rounded-full ${link.label === 'Shop All' ? 'bg-[#c9a962] text-black shadow-[0_0_15px_rgba(201,169,98,0.4)] hover:scale-105' : 'text-white/70 hover:text-[#c9a962]'}`}
                   >
                     {link.label}
                   </Link>
                 : <a 
                     key={link.label} 
                     href={link.href} 
                     className="text-[11px] font-black text-white/70 hover:text-[#c9a962] uppercase tracking-[0.1em] transition-all shrink-0"
                   >
                     {link.label}
                   </a>
            ))}
            <div className="ml-auto flex items-center gap-4">
               <span className="text-[10px] font-black text-[#c9a962] uppercase tracking-[0.2em] animate-pulse">New Drop: Phantom V4</span>
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
                 <span className="font-outfit font-bold text-xl">ELITE <span className="text-[#c9a962]">MENU</span></span>
                 <button onClick={() => setMobileOpen(false)} className="p-2 glass rounded-full"><Menu className="rotate-90" /></button>
              </div>
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                  link.isRoute ? (
                    <Link key={link.label} to={link.href} className="text-lg font-bold hover:text-[#c9a962] transition-colors" onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  ) : (
                    <Link key={link.label} to={link.href} className="text-lg font-bold hover:text-[#c9a962] transition-colors" onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  )
                ))}
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
