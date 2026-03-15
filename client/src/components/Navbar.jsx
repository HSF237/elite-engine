import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, Search, Heart, User, ChevronDown, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const NAV_LINKS = [
  { label: 'Fresh', href: '#fresh' },
  { label: 'Elite Video', href: '#video' },
  { label: 'Shop All', href: '/shop', isRoute: true },
  { label: "Today's Deals", href: '#deals' },
  { label: 'Footwear', href: '#footwear' },
  { label: 'Apparel', href: '#apparel' },
  { label: 'Electronics', href: '#electronics' },
  { label: 'Beauty', href: '#beauty' },
]

import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-8">
        {/* Logo */}
        <Link to="/" className="font-outfit font-bold text-2xl tracking-tighter text-white shrink-0 flex items-center gap-1 group">
          <div className="w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
             <ShoppingBag className="w-5 h-5 text-black" />
          </div>
          <span>ELITE<span className="text-[#c9a962]">STORE</span></span>
        </Link>

        {/* Deliver to - Amazon style */}
        <div className="hidden lg:flex items-center gap-1 text-white/70 hover:text-white cursor-pointer transition-colors group">
           <MapPin className="w-4 h-4 mt-1 group-hover:text-[#c9a962]" />
           <div className="flex flex-col">
              <span className="text-[10px] leading-none uppercase tracking-tighter">Deliver to</span>
              <span className="text-sm font-bold leading-tight">India</span>
           </div>
        </div>

        {/* Search Bar - Amazon style */}
        <div className="flex-1 max-w-2xl relative hidden sm:flex">
          <div className="flex w-full rounded-xl overflow-hidden glass border border-white/10 group focus-within:ring-2 focus-within:ring-[#c9a962]/50 transition-all">
            <div className="bg-white/5 border-r border-white/10 px-3 flex items-center gap-1 text-xs text-white/60 hover:bg-white/10 cursor-pointer transition-colors">
               All <ChevronDown className="w-3 h-3" />
            </div>
            <input 
              type="text" 
              placeholder="Search Elite Products, Brands and Categories"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-white/30"
            />
            <button className="bg-[#c9a962] hover:bg-[#b09452] px-5 flex items-center justify-center transition-colors">
               <Search className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Actions Icons */}
        <div className="flex items-center gap-1 sm:gap-3 ml-auto text-white/80">
          {user ? (
            <div className="hidden sm:flex flex-col items-start px-2 group relative">
              <div className="flex flex-col items-center cursor-pointer group-hover:text-[#c9a962] transition-colors">
                <User className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Hi, {user.name.split(' ')[0]}</span>
              </div>
              {/* Simple logout tooltip/dropdown on hover */}
              <div className="absolute top-full right-0 mt-2 w-32 glass border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-400 hover:bg-white/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex flex-col items-center hover:text-white transition-colors px-2 group">
              <User className="w-5 h-5 group-hover:text-[#c9a962]" />
              <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Sign In</span>
            </Link>
          )}

          <a href="/wishlist" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'group-hover:text-red-400'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>

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

      {/* Bottom Sub Nav - Flipkart/Amazon style */}
      <div className="hidden md:block bg-black/30 border-t border-white/5 py-1.5 backdrop-blur-md">
         <div className="max-w-[1440px] mx-auto px-6 flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-1.5 text-xs font-black text-white hover:text-[#c9a962] uppercase tracking-tighter transition-colors shrink-0">
               <Menu className="w-4 h-4" /> All
            </button>
            {NAV_LINKS.map(link => (
               link.isRoute
                 ? <Link key={link.label} to={link.href} className="text-xs font-bold text-[#c9a962] hover:text-white uppercase tracking-tighter transition-colors shrink-0 border border-[#c9a962]/30 px-2 py-0.5 rounded-md">{link.label}</Link>
                 : <a key={link.label} href={link.href} className="text-xs font-semibold text-white/70 hover:text-[#c9a962] uppercase tracking-tighter transition-colors shrink-0">{link.label}</a>
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
                  <a key={link.label} href={link.href} className="text-lg font-bold hover:text-[#c9a962] transition-colors" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
