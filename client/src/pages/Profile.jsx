import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, MapPin, Package, Settings, LogOut, ChevronRight, Plus, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import OptimizedImage from '../components/OptimizedImage'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState(null)
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes, addressesRes] = await Promise.all([
          api.get('/api/user/profile'),
          api.get('/api/orders/me'),
          api.get('/api/user/address')
        ])
        setProfileData(profileRes.data)
        setOrders(ordersRes.data)
        setAddresses(addressesRes.data)
      } catch (err) {
        console.error('Failed to fetch profile data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const { data } = await api.put('/api/user/profile', profileData)
      setProfileData(data)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error('Update failed', err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#c9a962] animate-spin" />
    </div>
  )

  const TABS = [
    { id: 'profile', label: 'Identity', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'History', icon: <Package className="w-4 h-4" /> },
    { id: 'addresses', label: 'Places', icon: <MapPin className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#c9a962] to-[#b09452] p-1 shadow-2xl shadow-[#c9a962]/20">
              <div className="w-full h-full rounded-[1.8rem] bg-[#1a1a1c] flex items-center justify-center overflow-hidden">
                {profileData?.avatar ? (
                  <OptimizedImage src={profileData.avatar} alt={profileData?.name} width={100} quality={70} wrapperClassName="w-full h-full" />
                ) : (
                  <span className="text-3xl font-black text-[#c9a962]">{profileData?.name?.[0]}</span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-outfit font-black uppercase tracking-tighter">{profileData?.name}</h1>
              <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-xs mt-1">{profileData?.role} / Elite Member</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === tab.id ? 'bg-[#c9a962] text-black shadow-xl shadow-[#c9a962]/20' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? '' : 'group-hover:translate-x-1'}`} />
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#111113] rounded-[2.5rem] border border-white/5 p-8 sm:p-12 shadow-2xl"
                >
                  <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter mb-8">Personal Details</h3>
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Display Name</label>
                      <input 
                        className="w-full bg-white/2 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                        value={profileData?.name || ''}
                        onChange={e => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Email Identity</label>
                       <input 
                        disabled
                        className="w-full bg-white/1 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white/20 cursor-not-allowed"
                        value={profileData?.email || ''}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Phone Primary</label>
                       <input 
                        className="w-full bg-white/2 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                        value={profileData?.phone || ''}
                        onChange={e => setProfileData({...profileData, phone: e.target.value})}
                       />
                    </div>

                    <div className="sm:col-span-2 pt-6">
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#c9a962] transition-all flex items-center justify-center gap-2"
                      >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Modifications'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-2 px-4">
                    <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter">Order History</h3>
                    <span className="text-[10px] font-black uppercase text-[#c9a962] tracking-widest">{orders.length} Mandates</span>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="bg-[#111113] py-20 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center">
                      <Package className="w-16 h-16 text-white/10 mb-4" />
                      <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest">No previous orders found.</p>
                    </div>
                  ) : (
                    orders.map(order => <OrderCard key={order._id} order={order} />)
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter">Saved Places</h3>
                    <button 
                      onClick={() => navigate('/checkout')} // Temporary logic to use checkout form
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#c9a962] text-black text-[10px] font-black uppercase tracking-widest"
                    >
                      <Plus className="w-4 h-4" /> Add Placement
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                      <div key={addr._id} className={`p-8 rounded-[2rem] bg-[#111113] border transition-all ${addr.isDefault ? 'border-[#c9a962]/40 bg-[#c9a962]/5' : 'border-white/5 hover:border-[#c9a962]/30'}`}>
                         <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                               <MapPin className="w-4 h-4 text-[#c9a962]" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{addr.label}</span>
                            </div>
                            {addr.isDefault && <CheckCircle2 className="w-5 h-5 text-[#c9a962]" />}
                         </div>
                         <p className="text-sm font-bold text-white mb-2">{addr.street}</p>
                         <p className="text-xs text-white/40 leading-relaxed">{addr.city}, {addr.state} - {addr.zip}</p>
                         <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                            <button className="text-[10px] font-black uppercase tracking-widest text-[#c9a962] hover:text-white transition-colors">Edit</button>
                            <button className="text-[10px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors">Delete</button>
                         </div>
                      </div>
                    ))}
                  </div>

                  {addresses.length === 0 && (
                    <div className="bg-[#111113] py-24 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center opacity-50">
                      <MapPin className="w-16 h-16 mb-4" />
                      <p className="font-black text-xs uppercase tracking-widest">Your placement list is empty</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const OrderCard = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered']
  const currentStep = statusSteps.indexOf(order.orderStatus)
  
  return (
    <div className="bg-[#111113] rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-[#c9a962]/20">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group"
      >
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-20 h-20 rounded-2xl bg-white/5 p-1 relative overflow-hidden shrink-0">
             <OptimizedImage src={order.items[0]?.image} alt={order.items[0]?.name} width={100} quality={50} wrapperClassName="w-full h-full" />
             {order.items.length > 1 && (
               <div className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-center">
                  <span className="text-[8px] font-black text-[#c9a962]">+{order.items.length - 1} MORE</span>
               </div>
             )}
          </div>
          <div>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Mandate ID: #{order.orderCode || order._id.slice(-8)}</p>
             <h4 className="font-bold text-white text-base group-hover:text-[#c9a962] transition-colors line-clamp-1">{order.items[0]?.name}</h4>
             <p className="text-xs font-bold text-white/60 mt-1">₹{order.totalAmount.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
            order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-[#c9a962]/10 text-[#c9a962]'
          }`}>
             {order.orderStatus}
          </div>
          <ChevronRight className={`w-5 h-5 text-white/20 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-8 border-t border-white/5">
              {/* Timeline Stepper */}
              <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a962] mb-8 text-center">Mandate Genesis Timeline</p>
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                  {/* Track line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2" />
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-[#c9a962] -translate-y-1/2 transition-all duration-1000" 
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                  
                  {statusSteps.map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                         i <= currentStep ? 'bg-[#c9a962] border-[#c9a962] text-black shadow-lg shadow-[#c9a962]/20' : 'bg-[#1a1a1c] border-white/5 text-white/20'
                       }`}>
                          {i === 0 && <Package className="w-5 h-5" />}
                          {i === 1 && <Loader2 className={`w-5 h-5 ${i === currentStep ? 'animate-spin' : ''}`} />}
                          {i === 2 && <MapPin className="w-5 h-5" />}
                          {i === 3 && <CheckCircle2 className="w-5 h-5" />}
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-tighter ${i <= currentStep ? 'text-white' : 'text-white/20'}`}>
                         {step}
                       </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[#c9a962] mb-4">Elite Logistics</h5>
                    <div className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/30 uppercase">ETA</span>
                          <span className="text-xs font-black text-green-400">{order.deliveryTime || 'Calibrating...'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/30 uppercase">Genesis Date</span>
                          <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-white/30 uppercase">Settlement</span>
                          <span className="text-xs font-bold uppercase">{order.paymentMethod}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div>
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[#c9a962] mb-4">Secured Assets</h5>
                    <div className="space-y-3">
                       {order.items.map((item, i) => (
                         <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                            <OptimizedImage src={item.image} alt={item.name} width={40} quality={40} wrapperClassName="w-10 h-10 rounded-lg overflow-hidden shrink-0" />
                            <div className="flex-1">
                               <p className="text-xs font-bold text-white/80">{item.name}</p>
                               <p className="text-[9px] font-black text-white/20 uppercase">Qty: {item.qty} | Size: {item.size}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
