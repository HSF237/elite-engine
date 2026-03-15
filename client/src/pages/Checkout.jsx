import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, CreditCard, ChevronRight, CheckCircle2, 
  MapPinLine, Home, Briefcase, Plus, X, Loader2 
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

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
  const [newAddress, setNewAddress] = useState({
    street: '', city: '', state: '', zip: '', label: 'Home', phone: '', age: '', dob: ''
  })

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('COD')

  useEffect(() => {
    if (!user) navigate('/login')
    if (items.length === 0) navigate('/shop')
    
    // Fetch addresses
    api.get('/api/user/address')
      .then(res => {
        setAddresses(res.data)
        const def = res.data.find(a => a.isDefault) || res.data[0]
        if (def) setSelectedAddress(def)
      })
  }, [user, items, navigate])

  const handleCreateOrder = async () => {
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
        shippingAddress: selectedAddress,
        paymentMethod,
        totalAmount: total
      }
      
      const { data } = await api.post('/api/orders', orderData)
      navigate('/order-success', { state: { order: data } })
    } catch (err) {
      console.error('Order creation failed', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/user/address', newAddress)
      setAddresses(data)
      setSelectedAddress(data[data.length - 1])
      setShowAddForm(false)
    } catch (err) {
      console.error('Add address failed', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Progress Tracker (Mobile & Tablet) */}
        <div className="lg:col-span-12 flex items-center justify-between mb-8 overflow-x-auto no-scrollbar py-2">
           {[1, 2, 3].map(num => (
             <div key={num} className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                 step === num ? 'bg-[#c9a962] border-[#c9a962] text-black' : 
                 step > num ? 'bg-green-500 border-green-500 text-white' : 'border-white/10 text-white/40'
               }`}>
                 {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
               </div>
               <span className={`text-[10px] uppercase font-black tracking-widest ${step === num ? 'text-white' : 'text-white/20'}`}>
                 {num === 1 ? 'Shipping' : num === 2 ? 'Payment' : 'Review'}
               </span>
               {num < 3 && <div className="w-12 h-px bg-white/5 mx-2" />}
             </div>
           ))}
        </div>

        {/* Left: Interactive Section */}
        <div className="lg:col-span-8 space-y-8">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">Shipping Address</h2>
                    <p className="text-xs text-white/40 font-bold tracking-widest uppercase mt-1">Select your delivery place</p>
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#c9a962]/30 text-[#c9a962] text-[10px] font-black uppercase hover:bg-[#c9a962] hover:text-black transition-all"
                  >
                    <Plus className="w-3 h-3" /> New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                        selectedAddress?._id === addr._id ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           {addr.label === 'Home' ? <Home className="w-4 h-4 text-[#c9a962]" /> : <Briefcase className="w-4 h-4 text-[#c9a962]" />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{addr.label}</span>
                        </div>
                        {selectedAddress?._id === addr._id && <CheckCircle2 className="w-5 h-5 text-[#c9a962]" />}
                      </div>
                      <p className="text-sm font-bold text-white/90 leading-relaxed mb-1">{addr.street}</p>
                      <p className="text-xs text-white/40 font-medium">{addr.city}, {addr.state} - {addr.zip}</p>
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && !showAddForm && (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                    <MapPinLine className="w-12 h-12 text-white/10 mb-4" />
                    <p className="text-sm font-bold text-white/40">No saved addresses found.</p>
                  </div>
                )}

                <button 
                  disabled={!selectedAddress}
                  onClick={() => setStep(2)}
                  className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#c9a962] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">Payment Method</h2>
                  <p className="text-xs text-white/40 font-bold tracking-widest uppercase mt-1">Choose how you want to pay</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {[
                     { id: 'UPI', name: 'UPI / Google Pay', desc: 'Secure digital payment', icon: '⚡' },
                     { id: 'COD', name: 'Cash on Delivery', desc: 'Pay when items arrive', icon: '📦' },
                     { id: 'CARD', name: 'Debit / Credit Card', desc: 'All major cards accepted', icon: '💳' }
                   ].map(method => (
                     <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          paymentMethod === method.id ? 'border-[#c9a962] bg-[#c9a962]/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                           {method.icon}
                         </div>
                         <div>
                            <h4 className="font-bold text-white tracking-tight">{method.name}</h4>
                            <p className="text-xs text-white/30 font-medium">{method.desc}</p>
                         </div>
                       </div>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                         paymentMethod === method.id ? 'border-[#c9a962]' : 'border-white/10'
                       }`}>
                         {paymentMethod === method.id && <div className="w-3 h-3 rounded-full bg-[#c9a962]" />}
                       </div>
                     </div>
                   ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 h-16 border border-white/10 rounded-2xl text-white/40 font-black uppercase tracking-widest text-xs hover:text-white hover:bg-white/5 transition-all"
                  >
                    Back to Address
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-[2] h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#c9a962] transition-all flex items-center justify-center gap-2"
                  >
                    Review Order <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-outfit font-black uppercase tracking-tighter">Final Review</h2>
                  <p className="text-xs text-white/40 font-bold tracking-widest uppercase mt-1">One last check before placing order</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                       <MapPin className="w-4 h-4 text-[#c9a962]" />
                       <span className="text-[10px] font-black uppercase text-[#c9a962] tracking-widest">Delivery To</span>
                    </div>
                    <p className="text-sm font-bold mb-1">{selectedAddress.street}</p>
                    <p className="text-xs text-white/40 font-medium">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                       <CreditCard className="w-4 h-4 text-[#c9a962]" />
                       <span className="text-[10px] font-black uppercase text-[#c9a962] tracking-widest">Payment Method</span>
                    </div>
                    <p className="text-sm font-bold mb-1">{paymentMethod}</p>
                    <p className="text-xs text-white/40 font-medium">Safe & Secure Checkout</p>
                  </div>
                </div>

                <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#c9a962]/20 to-transparent border border-[#c9a962]/20 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="text-center md:text-left">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c9a962] mb-2">Total Payable</p>
                     <h3 className="text-5xl font-outfit font-black tracking-tighter">₹{total.toLocaleString()}</h3>
                   </div>
                   <button 
                    onClick={handleCreateOrder}
                    disabled={loading}
                    className="w-full md:w-auto px-12 h-16 bg-[#c9a962] text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-[#c9a962]/30"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Order & Pay'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Summary Bucket */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-6">
          <div className="glass p-8 rounded-[3rem] border-white/10 shadow-2xl">
            <h3 className="font-outfit font-black text-xl uppercase tracking-tighter mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 p-1 shrink-0 overflow-hidden">
                    <img src={item.image} alt="" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold truncate pr-4">{item.title}</h5>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                      {item.size} • {item.qty} Unit
                    </p>
                    <p className="text-xs font-bold text-[#c9a962] mt-1">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6 text-[10px] font-black uppercase tracking-widest">
              <div className="flex justify-between text-white/40">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>GST (12%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Delivery</span>
                <span>{delivery > 0 ? `₹${delivery}` : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-lg text-white border-t border-white/5 pt-4">
                <span className="font-outfit">Total</span>
                <span className="font-outfit text-[#c9a962]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
               onClick={() => setShowAddForm(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-[#111113] p-8 rounded-[2.5rem] border border-white/10 z-[110] shadow-2xl"
            >
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter">Add Placement</h3>
                 <button onClick={() => setShowAddForm(false)} className="p-2 glass rounded-full hover:bg-red-500/10 hover:text-red-500 transition-all">
                   <X className="w-5 h-5" />
                 </button>
               </div>

               <form onSubmit={handleAddAddress} className="space-y-4">
                 <div className="flex gap-2">
                   {['Home', 'Office', 'Other'].map(l => (
                     <button 
                        key={l}
                        type="button"
                        onClick={() => setNewAddress({...newAddress, label: l})}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          newAddress.label === l ? 'bg-[#c9a962] border-[#c9a962] text-black' : 'border-white/10 text-white/30 hover:border-white/20'
                        }`}
                     >
                       {l}
                     </button>
                   ))}
                 </div>
                 <input 
                    required placeholder="Street Address / House No." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                    value={newAddress.street}
                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      required placeholder="City" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input 
                      required placeholder="State" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                      value={newAddress.state}
                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    />
                 </div>
                 <input 
                    required placeholder="ZIP / Pincode" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                    value={newAddress.zip}
                    onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                       required placeholder="Age" type="number"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                       value={newAddress.age}
                       onChange={e => setNewAddress({...newAddress, age: e.target.value})}
                    />
                    <input 
                       required placeholder="DOB (DD/MM/YYYY)" 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#c9a962]/50"
                       value={newAddress.dob}
                       onChange={e => setNewAddress({...newAddress, dob: e.target.value})}
                    />
                 </div>
                 <button className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm mt-4 hover:bg-[#c9a962] transition-colors">
                   Save Placement
                 </button>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
