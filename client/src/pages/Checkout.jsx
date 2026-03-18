import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, CreditCard, ChevronRight, CheckCircle2, 
  Home, Briefcase, Plus, X, Loader2, ExternalLink 
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import OptimizedImage from '../components/OptimizedImage'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, subtotal, tax, delivery } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Confirm
  const [loading, setLoading] = useState(false)
  
  // Address State
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSettingPrimary, setIsSettingPrimary] = useState(true)
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    deliveryTime: '',
    instructions: ''
  })

  const applyPromo = () => {
    setPromoError('')
    if (promoCode.toUpperCase() === 'ELITE10') {
      const amt = subtotal * 0.1
      setDiscount(amt)
    } else {
      setPromoError('Invalid Voucher Code')
      setDiscount(0)
    }
  }

  const finalTotal = total - discount

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (items.length === 0) {
      navigate('/shop')
      return
    }
    
    // Fetch addresses and auto-select default or first
    api.get('/api/user/address')
      .then(res => {
        setAddresses(res.data)
        const def = res.data.find(a => a.isDefault) || res.data[0]
        if (def) setSelectedAddress(def)
        
        api.get('/api/user/profile').then(profileRes => {
           setNewAddress(prev => ({
             ...prev,
             phone: profileRes.data.phone || '',
           }))
        })
      })
  }, [user, items, navigate])

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a target placement first.')
      setStep(1)
      return
    }
    setLoading(true)
    try {
      const orderData = {
        items: items.map(i => ({
          product: i.id,
          name: i.title,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
          image: i.image
        })),
        shippingAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          country: selectedAddress.country || 'India',
          phone: selectedAddress.phone || user?.phone || '',
          deliveryTime: selectedAddress.deliveryTime || '',
          instructions: selectedAddress.instructions || ''
        },
        paymentMethod,
        totalAmount: finalTotal,
        promoCode: discount > 0 ? promoCode : null,
        discountAmount: discount
      }
      
      const { data } = await api.post('/api/orders', orderData)
      navigate('/order-success', { state: { order: data } })
    } catch (err) {
      console.error('Order creation failed', err)
      alert(err.response?.data?.message || 'Order settlement failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/user/address', { 
        ...newAddress, 
        isDefault: isSettingPrimary 
      })
      setAddresses(data)
      const added = data.find(a => a.street === newAddress.street) || data[data.length - 1]
      setSelectedAddress(added)
      setShowAddForm(false)
      alert('Destination successfully registered.')
    } catch (err) {
      console.error('Add address failed', err)
      alert(err.response?.data?.message || 'Failed to register placement. Please check all fields.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Progress Tracker */}
        <div className="lg:col-span-12 flex items-center justify-between mb-8 overflow-x-auto no-scrollbar py-2 border-b border-white/5 pb-6">
           {[
             { n: 1, l: 'Placement' },
             { n: 2, l: 'Settlement' },
             { n: 3, l: 'Verification' }
           ].map(s => (
             <div key={s.n} className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs border-2 transition-all ${
                 step === s.n ? 'bg-[#c9a962] border-[#c9a962] text-black shadow-lg shadow-[#c9a962]/20' : 
                 step > s.n ? 'bg-green-500 border-green-500 text-white' : 'border-white/10 text-white/20'
               }`}>
                 {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
               </div>
               <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${step === s.n ? 'text-white' : 'text-white/20'}`}>
                 {s.l}
               </span>
               {s.n < 3 && <div className={`w-16 h-px mx-4 ${step > s.n ? 'bg-green-500' : 'bg-white/5'}`} />}
             </div>
           ))}
        </div>

        {/* Left Section */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-outfit font-black uppercase tracking-tighter">Target Placement</h2>
                    <p className="text-[10px] text-[#c9a962] font-black tracking-[0.4em] uppercase mt-2">Where should we deliver the excellence?</p>
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Destination
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all group ${
                        selectedAddress?._id === addr._id ? 'border-[#c9a962] bg-[#c9a962]/5 shadow-2xl shadow-[#c9a962]/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#c9a962]">
                             {addr.label === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{addr.label}</span>
                        </div>
                        {selectedAddress?._id === addr._id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-6 h-6 text-[#c9a962]" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-base font-bold text-white mb-2 leading-tight">{addr.street}</p>
                      <p className="text-xs text-white/40 font-medium leading-relaxed">{addr.city}, {addr.state} - {addr.zip}</p>
                      <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] font-black uppercase tracking-widest text-[#c9a962]">Select for Dispatch</span>
                      </div>
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && !showAddForm && (
                  <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                    <MapPin className="w-16 h-16 text-white/10 mb-6" />
                    <p className="text-sm font-black uppercase tracking-widest text-white/20">Your placement list is currently empty.</p>
                  </div>
                )}

                <button 
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                  className="w-full h-20 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#c9a962] transition-all disabled:opacity-20 disabled:cursor-not-allowed mt-12 flex items-center justify-center gap-3"
                >
                  Proceed to Settlement <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-outfit font-black uppercase tracking-tighter">Settlement Portal</h2>
                  <p className="text-[10px] text-[#c9a962] font-black tracking-[0.4em] uppercase mt-2">Select your preferred transaction protocol</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {[
                     { id: 'UPI', name: 'Digital UPI / GPay', desc: 'Instant verification for priority processing', icon: '💎', color: 'from-blue-500/20' },
                     { id: 'COD', name: 'Elite Cash on Delivery', desc: 'Settle upon successful arrival', icon: '📦', color: 'from-[#c9a962]/20' },
                     { id: 'CARD', name: 'Global Credit Infrastructure', desc: 'Secure encryption for all major networks', icon: '💳', color: 'from-purple-500/20' }
                   ].map(method => (
                     <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group overflow-hidden relative ${
                          paymentMethod === method.id ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                        }`}
                     >
                       <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${method.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                       <div className="flex items-center gap-6 relative z-10">
                         <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                           {method.icon}
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-white tracking-tight uppercase">{method.name}</h4>
                            <p className="text-xs text-white/30 font-bold tracking-wide mt-1">{method.desc}</p>
                         </div>
                       </div>
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 transition-all ${
                         paymentMethod === method.id ? 'border-[#c9a962] bg-[#c9a962]/10' : 'border-white/10'
                       }`}>
                         {paymentMethod === method.id && <div className="w-4 h-4 rounded-full bg-[#c9a962]" />}
                       </div>
                     </div>
                   ))}
                </div>

                {paymentMethod === 'UPI' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 mt-6 flex items-center gap-4">
                     <span className="font-outfit font-black text-[#c9a962]">TEST UPI ID</span>
                     <input type="text" readOnly value="demouser@okicici" className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm font-black outline-none" />
                  </motion.div>
                )}

                {paymentMethod === 'CARD' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="col-span-2 lg:col-span-4">
                       <span className="font-outfit font-black text-[#c9a962] text-[10px] block mb-2">DEMO CARD NUMBER</span>
                       <input type="text" readOnly value="4242 4242 4242 4242" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm font-black outline-none tracking-widest" />
                     </div>
                     <div className="col-span-1 lg:col-span-2">
                       <span className="font-outfit font-black text-[#c9a962] text-[10px] block mb-2">EXPIRY</span>
                       <input type="text" readOnly value="12/25" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm font-black outline-none" />
                     </div>
                     <div className="col-span-1 lg:col-span-2">
                       <span className="font-outfit font-black text-[#c9a962] text-[10px] block mb-2">CVV</span>
                       <input type="text" readOnly value="123" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm font-black outline-none" />
                     </div>
                  </motion.div>
                )}

                <div className="flex gap-6 mt-12">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 h-20 border border-white/10 rounded-[2rem] text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/5 transition-all"
                  >
                    Adjust Placement
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] h-20 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#c9a962] transition-all flex items-center justify-center gap-3"
                  >
                    Review Manifest <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-outfit font-black uppercase tracking-tighter">Elite Manifest</h2>
                  <p className="text-[10px] text-[#c9a962] font-black tracking-[0.4em] uppercase mt-2">Final verification of your premium request</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group">
                    <div className="flex items-center gap-3 mb-6">
                       <MapPin className="w-5 h-5 text-[#c9a962]" />
                       <span className="text-[10px] font-black uppercase text-[#c9a962] tracking-[0.3em]">Destination Info</span>
                    </div>
                    <p className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{selectedAddress?.street}</p>
                    <p className="text-sm text-white/40 font-medium italic">{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zip}</p>
                    <p className="text-[8px] font-black uppercase text-white/20 mt-6 tracking-widest">Phone: {selectedAddress?.phone || user.phone}</p>
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group">
                    <div className="flex items-center gap-3 mb-6">
                       <CreditCard className="w-5 h-5 text-[#c9a962]" />
                       <span className="text-[10px] font-black uppercase text-[#c9a962] tracking-[0.3em]">Settlement Method</span>
                    </div>
                    <p className="text-lg font-bold mb-2 group-hover:text-white transition-colors uppercase">{paymentMethod}</p>
                    <p className="text-sm text-white/40 font-medium italic">Verified secure transaction channel</p>
                  </motion.div>
                </div>

                <div className="p-10 rounded-[3.5rem] bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a962]/5 blur-[100px] -mr-32 -mt-32" />
                   <div className="text-center md:text-left relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c9a962] mb-3">Total Manifest Value</p>
                     <h3 className="text-6xl font-outfit font-black tracking-tighter">₹{finalTotal.toLocaleString()}</h3>
                   </div>
                   <button 
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="w-full md:w-auto px-16 h-20 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#c9a962] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(201,169,98,0.2)] relative z-10"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Placement'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
           <div className="bg-[#111113] p-10 rounded-[3.5rem] border border-white/5 shadow-3xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                 <h3 className="font-outfit font-black text-2xl uppercase tracking-tighter">Shopping Bag</h3>
                 <span className="bg-[#c9a962]/10 text-[#c9a962] text-[10px] font-black px-3 py-1 rounded-lg">{items.length} Items</span>
              </div>
              
              <div className="space-y-6 mb-10 max-h-[40vh] overflow-y-auto pr-4 no-scrollbar">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-5 group">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 p-1 shrink-0 overflow-hidden border border-white/5 group-hover:border-[#c9a962]/30 transition-colors">
                      <OptimizedImage
                        src={item.image}
                        alt={item.title}
                        width={100}
                        quality={60}
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <h5 className="text-sm font-bold text-white/90 truncate pr-2 group-hover:text-white transition-colors">{item.title}</h5>
                      <p className="text-[9px] text-[#c9a962] font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <span>{item.size}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Qty: {item.qty}</span>
                      </p>
                      <p className="text-sm font-black text-white mt-2">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Section */}
              <div className="border-t border-white/5 pt-8 mb-8">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-2">Secure Voucher</p>
                 <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. ELITE10"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs outline-none focus:border-[#c9a962]/40 transition-all uppercase placeholder:text-white/10"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                    />
                    <button 
                      onClick={applyPromo}
                      className="px-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#c9a962] hover:text-black transition-all"
                    >
                      Apply
                    </button>
                 </div>
                 {promoError && <p className="text-[9px] font-bold text-red-500 mt-2 ml-2 uppercase tracking-tighter">{promoError}</p>}
                 {discount > 0 && <p className="text-[9px] font-bold text-green-500 mt-2 ml-2 uppercase tracking-tighter">Voucher applied: -₹{discount.toLocaleString()}</p>}
              </div>

              <div className="space-y-5 border-t border-white/5 pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <div className="flex justify-between hover:text-white transition-colors">
                  <span>Elite Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between hover:text-white transition-colors">
                  <span>Taxation (Included)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between hover:text-[#c9a962] transition-colors">
                  <span>Priority Shipping</span>
                  <span className="text-green-500">{delivery > 0 ? `₹${delivery}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-2xl text-white border-white/5 pt-6 border-t font-outfit">
                  <span className="tracking-tighter">Total Due</span>
                  <span className="font-black text-[#c9a962]">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* Add Placement Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-scrollbar"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-xl bg-[#0d0d0e] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden"
               onClick={e => e.stopPropagation()}
            >
               <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter">Define Placement</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] mt-2 italic">Register a new target destination</p>
                 </div>
                 <button onClick={() => setShowAddForm(false)} className="p-3 glass rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all">
                   <X className="w-5 h-5" />
                 </button>
               </div>

               <form onSubmit={handleAddAddress} className="space-y-4">
                 <div className="grid grid-cols-3 gap-2">
                   {['Home', 'Office', 'Other'].map(l => (
                     <button 
                        key={l}
                        type="button"
                        onClick={() => setNewAddress({...newAddress, label: l})}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${
                          newAddress.label === l ? 'bg-[#c9a962] border-[#c9a962] text-black shadow-lg shadow-[#c9a962]/20' : 'border-white/10 text-white/20 hover:border-white/40'
                        }`}
                     >
                       {l}
                     </button>
                   ))}
                  </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a962]">Target Placement</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${newAddress.street} ${newAddress.city} ${newAddress.state} ${newAddress.zip}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase text-white/40 hover:text-[#c9a962] transition-colors"
                      >
                        Locate <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <input 
                      required placeholder="Street Address / Building" 
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                      value={newAddress.street}
                      onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <input 
                          required placeholder="City Domain" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                          value={newAddress.city}
                          onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                        />
                        <input 
                          required placeholder="State Territory" 
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                          value={newAddress.state}
                          onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                        />
                    </div>
                    <input 
                        required placeholder="Postal / ZIP Code" 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                        value={newAddress.zip}
                        onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                           <input 
                              required 
                              list="time-suggestions"
                              placeholder="Preferred Time (e.g. 10 AM)" 
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                              value={newAddress.deliveryTime}
                              onChange={e => setNewAddress({...newAddress, deliveryTime: e.target.value})}
                           />
                           <datalist id="time-suggestions">
                              <option value="08:00 - 12:00 (Morning)" />
                              <option value="12:00 - 16:00 (Afternoon)" />
                              <option value="16:00 - 20:00 (Evening)" />
                           </datalist>
                        </div>
                        <input 
                           required placeholder="Handling Notes" 
                           className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-xs outline-none focus:border-[#c9a962] transition-all"
                           value={newAddress.instructions}
                           onChange={e => setNewAddress({...newAddress, instructions: e.target.value})}
                        />
                    </div>
                 </div>

                 {/* Set as Primary Toggle */}
                 <div 
                   onClick={() => setIsSettingPrimary(!isSettingPrimary)}
                   className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer group hover:border-[#c9a962]/30 transition-all"
                 >
                    <div>
                       <p className="text-[10px] font-black uppercase text-white tracking-widest">Mark as Primary Placement</p>
                       <p className="text-[8px] text-white/30 font-bold uppercase mt-1">Automatically selected for future dispatch</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-all ${isSettingPrimary ? 'bg-[#c9a962]' : 'bg-white/10'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${isSettingPrimary ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                 </div>

                 <button className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-4 hover:bg-[#c9a962] transition-all shadow-2xl">
                   Secure Placement
                 </button>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
