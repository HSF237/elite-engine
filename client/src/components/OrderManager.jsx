import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, User, MapPin, CreditCard, 
  Calendar, Clock, CheckCircle, Package, 
  Truck, Search, Filter, X, ChevronRight,
  MoreVertical, ExternalLink
} from 'lucide-react'
import api from '../utils/api'

export default function OrderManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Order update data
  const [updateData, setUpdateData] = useState({
    orderStatus: '',
    deliveryTime: '',
    paymentStatus: ''
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/all')
      setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (order) => {
    setSelectedOrder(order)
    setUpdateData({
      orderStatus: order.orderStatus,
      deliveryTime: order.deliveryTime,
      paymentStatus: order.paymentStatus
    })
    setIsModalOpen(true)
  }

  const handleUpdate = async () => {
    try {
      await api.put(`/api/orders/${selectedOrder._id}`, updateData)
      setIsModalOpen(false)
      fetchOrders()
    } catch (err) {
      console.error('Update failed', err)
      alert('Failed to update order')
    }
  }

  const filteredOrders = orders.filter(o => 
    o.orderCode.toLowerCase().includes(search.toLowerCase()) || 
    o.customer?.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-400 bg-green-400/10'
      case 'Cancelled': return 'text-red-400 bg-red-400/10'
      case 'Shipped': return 'text-blue-400 bg-blue-400/10'
      case 'Processing': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-white/40 bg-white/5'
    }
  }

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c9a962] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-outfit font-black uppercase tracking-tighter mb-2">Order Vault</h2>
          <p className="text-white/40 text-sm font-medium">Control and fulfill elite customer mandates.</p>
        </div>
        
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-[#c9a962]/50 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleOpenModal(order)}
            className="group bg-[#111113] p-6 rounded-[2rem] border border-white/5 hover:border-[#c9a962]/30 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 shrink-0">
               <Package className="w-8 h-8 group-hover:text-[#c9a962] group-hover:scale-110 transition-all" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
               <div>
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Mandate ID</p>
                  <h4 className="font-bold text-white tracking-tight">#{order.orderCode}</h4>
               </div>

               <div>
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Customer</p>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-[#c9a962]" />
                    <h4 className="font-bold text-white/80">{order.customer?.name || 'Anonymous'}</h4>
                  </div>
               </div>

               <div>
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">Value</p>
                  <h4 className="font-bold text-[#c9a962]">₹{order.totalAmount.toLocaleString()}</h4>
               </div>

               <div className="ml-auto">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
               <button className="p-3 bg-white/5 rounded-xl hover:bg-[#c9a962] hover:text-black transition-all">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
            <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-sm font-bold text-white/20 uppercase tracking-widest">No matching mandates found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100]"
               onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }} 
               animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} 
               exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-40%' }}
               className="fixed left-1/2 top-1/2 w-[95%] max-w-4xl bg-[#0a0a0b] p-8 md:p-12 rounded-[3.5rem] border border-white/10 z-[110] shadow-3xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
               <div className="flex flex-col md:flex-row gap-12">
                  {/* Modal Left: Order Details */}
                  <div className="flex-1 space-y-8">
                     <div className="flex items-center justify-between">
                       <div>
                          <h3 className="text-4xl font-outfit font-black uppercase tracking-tighter">Mandate Scan</h3>
                          <p className="text-xs text-[#c9a962] font-black uppercase tracking-[0.3em] mt-1">ID: #{selectedOrder.orderCode}</p>
                       </div>
                       <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${getStatusColor(selectedOrder.orderStatus)}`}>
                          {selectedOrder.orderStatus}
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                           <div className="flex items-center gap-2 mb-3">
                             <User className="w-4 h-4 text-[#c9a962]" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a962]">Mandator</span>
                           </div>
                           <p className="text-sm font-bold">{selectedOrder.customer?.name}</p>
                           <p className="text-xs text-white/40 font-medium italic mb-1">{selectedOrder.customer?.email}</p>
                           <p className="text-xs text-[#c9a962] font-black uppercase tracking-tighter">Tel: {selectedOrder.shippingAddress?.phone || 'Not Provided'}</p>
                           <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Age: {selectedOrder.shippingAddress?.age} | DOB: {selectedOrder.shippingAddress?.dob}</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                           <div className="flex items-center gap-2 mb-3">
                             <CreditCard className="w-4 h-4 text-[#c9a962]" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a962]">Settlement</span>
                           </div>
                           <p className="text-sm font-bold">{selectedOrder.paymentMethod}</p>
                           <p className="text-xs text-green-400/60 font-medium uppercase tracking-tighter">{selectedOrder.paymentStatus}</p>
                        </div>
                     </div>

                     <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-4 h-4 text-[#c9a962]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#c9a962]">Target Destination</span>
                        </div>
                        <p className="text-sm font-bold mb-1">{selectedOrder.shippingAddress?.street}</p>
                        <p className="text-xs text-white/40 font-medium italic">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zip}</p>
                     </div>

                     <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Items Secured</h5>
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02]">
                            <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <h6 className="text-sm font-bold">{item.name}</h6>
                              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Qty: {item.qty} • Size: {item.size}</p>
                            </div>
                            <span className="text-sm font-black text-[#c9a962]">₹{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Modal Right: Staff Controls */}
                  <div className="w-full md:w-80 space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#c9a962]/10 to-transparent border border-[#c9a962]/20">
                        <h4 className="text-xl font-outfit font-black uppercase tracking-tighter mb-6">Staff Control</h4>
                        
                        <div className="space-y-6">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Order Status</p>
                              <select 
                                 value={updateData.orderStatus}
                                 onChange={e => setUpdateData({...updateData, orderStatus: e.target.value})}
                                 className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9a962]"
                              >
                                 <option value="Pending">Pending</option>
                                 <option value="Processing">Processing</option>
                                 <option value="Shipped">Shipped</option>
                                 <option value="Delivered">Delivered</option>
                                 <option value="Cancelled">Cancelled</option>
                              </select>
                           </div>

                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Est. Delivery Time</p>
                              <input 
                                 type="text"
                                 placeholder="e.g. Tomorrow, 4 PM"
                                 value={updateData.deliveryTime}
                                 onChange={e => setUpdateData({...updateData, deliveryTime: e.target.value})}
                                 className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9a962]"
                              />
                           </div>

                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Payment status</p>
                              <select 
                                 value={updateData.paymentStatus}
                                 onChange={e => setUpdateData({...updateData, paymentStatus: e.target.value})}
                                 className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-[#c9a962]"
                              >
                                 <option value="Pending">Payment Pending</option>
                                 <option value="Completed">Payment Settled</option>
                                 <option value="Failed">Settlement Failed</option>
                              </select>
                           </div>

                           <button 
                              onClick={handleUpdate}
                              className="w-full py-4 bg-[#c9a962] text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-[#c9a962]/20"
                           >
                              Apply Updates
                           </button>
                        </div>
                     </div>

                     <button 
                       onClick={() => setIsModalOpen(false)}
                       className="w-full py-4 border border-white/10 rounded-xl text-white/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
                     >
                        Close Portal
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
