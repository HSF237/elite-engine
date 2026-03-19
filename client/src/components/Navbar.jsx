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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0a0a0b]/95 backdrop-blur-2xl ${
        scrolled ? 'border-b border-white/10' : 'border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-1.5 sm:py-2">
        {/* Row 1: Logo & Top Actions */}
        <div className="flex items-center justify-between gap-4 h-10 sm:h-11">
          <Link to="/" className="font-outfit font-black text-lg sm:text-2xl tracking-tighter text-white flex items-center gap-1 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#c9a962] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
               <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <span>ELITE<span className="text-[#c9a962]">STORE</span></span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/shop" className="sm:hidden px-3 py-1.5 bg-[#c9a962] text-black font-black text-[8px] uppercase tracking-widest rounded-lg shadow-lg">
              Shop All
            </Link>
            
            <div className="flex sm:hidden items-center gap-0.5 ml-1">
               <Link to="/shop" className="p-1.5 relative text-white/80">
                  <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
               </Link>
               <button onClick={openCart} className="p-1.5 relative text-white/80">
                  <ShoppingBag className="w-4 h-4" />
                  {count > 0 && <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#c9a962] text-[7px] font-black text-black flex items-center justify-center">{count}</span>}
               </button>
               <button className="p-1.5 text-white/80" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        {/* Row 2: Search Bar & Account Controls */}
        <div className="flex items-center gap-2 mt-1.5 py-0.5">
           <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) navigate(`/shop?q=${encodeURIComponent(searchQuery)}`)
              }}
              className="flex-1 flex rounded-lg overflow-hidden glass border border-white/10 focus-within:ring-2 focus-within:ring-[#c9a962]/30 transition-all h-9"
           >
              <input 
                type="text" 
                placeholder="Elite Search Protocol..."
                className="flex-1 bg-transparent px-4 text-xs text-white focus:outline-none placeholder:text-white/20"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-[#c9a962] px-4 flex items-center justify-center">
                 <Search className="w-4 h-4 text-black" />
              </button>
           </form>

           <div className="flex sm:hidden items-center gap-1">
              {user ? (
                 <>
                    <Link to="/profile" className="w-8 h-8 rounded-lg bg-[#c9a962] flex items-center justify-center font-black text-[10px] text-black uppercase">{user.name?.[0]}</Link>
                    <button onClick={logout} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-red-500/50"><LogOut className="w-3.5 h-3.5" /></button>
                 </>
              ) : (
                 <Link to="/login" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60"><User className="w-4 h-4" /></Link>
              )}
           </div>
        </div>

        {/* Desktop Content Spacer - Only visible on sm+ */}
        <div className="hidden sm:flex items-center gap-8 w-full mt-3">
            <div className="hidden xl:flex items-center gap-1 text-white/70 hover:text-white cursor-pointer transition-colors group">
               <MapPin className="w-4 h-4 mt-1 group-hover:text-[#c9a962]" />
               <div className="flex flex-col">
                  <span className="text-[10px] leading-none uppercase tracking-tighter">Deliver to</span>
                  <span className="text-sm font-bold leading-tight">India</span>
               </div>
            </div>
            
            <div className="flex-1" />

            <div className="flex items-center gap-4 text-white/80">
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

      {/* Bottom Sub Nav categories bar */}
      <div className="block bg-transparent border-t border-white/5 py-1 w-full text-left overflow-x-auto no-scrollbar">
         <div className="max-w-[1440px] w-max mx-auto px-4 flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-1.5 text-[9px] font-black text-white hover:text-[#c9a962] uppercase tracking-widest transition-all shrink-0 group px-2"
            >
               <Menu className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> ALL
            </button>
            {NAV_LINKS.map(link => (
               <Link 
                 key={link.label} 
                 to={link.href} 
                 className={`text-[10px] font-black uppercase tracking-widest transition-all shrink-0 px-3 py-1 rounded-full ${link.label === 'Shop All' ? 'bg-[#c9a962] text-black' : 'text-white/60 hover:text-[#c9a962]'}`}
               >
                 {link.label}
               </Link>
            ))}
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
