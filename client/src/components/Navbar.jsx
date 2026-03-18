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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 sm:py-3 border-b border-white/5 sm:border-none">
        <div className="flex items-center justify-between w-full h-12 sm:h-auto gap-4">
          {/* Logo */}
          <Link to="/" className="font-outfit font-bold text-lg sm:text-2xl tracking-tighter text-white shrink-0 flex items-center gap-1 group">
            <div className="w-6 h-6 sm:w-8 h-8 bg-[#c9a962] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
               <ShoppingBag className="w-4 h-4 sm:w-5 h-5 text-black" />
            </div>
            <span>ELITE<span className="text-[#c9a962]">STORE</span></span>
          </Link>

          {/* SHOP ALL - Right on Mobile */}
          <Link 
            to="/shop" 
            className="px-3 py-1 bg-[#c9a962] text-black font-black text-[9px] uppercase tracking-[15%] rounded-lg shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop All
          </Link>
        </div>

        {/* Mobile Icons Row (Search Left, Others Right) */}
        <div className="flex sm:hidden items-center justify-between mt-2 py-1">
           <Link to="/shop" className="p-2 text-white/60 hover:text-[#c9a962] transition-colors">
              <Search className="w-5 h-5" />
           </Link>
           
           <div className="flex items-center gap-1">
              <Link to="/shop" className="p-2 relative text-white/80 group">
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlistCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] font-black flex items-center justify-center">{wishlistCount}</span>}
              </Link>
              <button onClick={openCart} className="p-2 relative text-white/80">
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#c9a962] text-[8px] font-black text-black flex items-center justify-center">{count}</span>}
              </button>
              {user && (
                <Link to="/profile" className="p-2">
                   <div className="w-6 h-6 rounded-lg bg-[#c9a962] flex items-center justify-center font-black text-[10px] text-black">{user.name?.[0]}</div>
                </Link>
              )}
              <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                <Menu className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* DESKTOP CONTENT (Hidden on Mobile) */}
        <div className="hidden sm:flex items-center gap-8 w-full mt-2 sm:mt-0">
           {/* Deliver to */}
            <div className="hidden xl:flex items-center gap-1 text-white/70 hover:text-white cursor-pointer transition-colors group">
               <MapPin className="w-4 h-4 mt-1 group-hover:text-[#c9a962]" />
               <div className="flex flex-col">
                  <span className="text-[10px] leading-none uppercase tracking-tighter">Deliver to</span>
                  <span className="text-sm font-bold leading-tight">India</span>
               </div>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 max-w-xl relative">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`)
                }}
                className="flex w-full rounded-lg overflow-hidden glass border border-white/10 group focus-within:ring-2 focus-within:ring-[#c9a962]/30 transition-all"
              >
                <div className="bg-white/5 border-r border-white/10 px-2 flex items-center gap-1 text-[10px] text-white/60 hover:bg-white/10 cursor-pointer transition-colors">
                   All <ChevronDown className="w-2.5 h-2.5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search Elite Collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white focus:outline-none placeholder:text-white/20"
                />
                <button type="submit" className="bg-[#c9a962] hover:bg-[#b09452] px-4 flex items-center justify-center transition-colors">
                   <Search className="w-4 h-4 text-black" />
                </button>
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center gap-3 text-white/80">
              <Link to="/shop" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : 'group-hover:text-red-400'}`} />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">{wishlistCount}</span>}
              </Link>
              <button onClick={openCart} className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
                <ShoppingBag className="w-5 h-5 group-hover:text-[#c9a962]" />
                {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#c9a962] text-[9px] font-bold text-black flex items-center justify-center">{count}</span>}
              </button>
              {user ? (
                <Link to="/profile" className="flex items-center gap-2 group p-2 rounded-xl hover:bg-white/5 transition-all">
                   <div className="w-8 h-8 rounded-lg bg-[#c9a962] flex items-center justify-center font-black text-xs text-black uppercase">{user.name?.[0]}</div>
                </Link>
              ) : (
                <Link to="/login" className="flex flex-col items-center hover:text-white transition-colors px-2 group">
                  <User className="w-5 h-5 group-hover:text-[#c9a962]" />
                  <span className="text-[10px] font-bold mt-0.5 uppercase tracking-tighter">Sign In</span>
                </Link>
              )}
            </div>
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
