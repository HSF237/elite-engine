import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Upload, Package, DollarSign, Layout, Type, Palette, Maximize, Truck, Loader2 } from 'lucide-react'
import api from '../utils/api'

export default function InventoryManager() {
  const [products, setProducts] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [imageFiles, setImageFiles] = useState([null, null, null, null])
  const [formData, setFormData] = useState({
    smallHeading: '',
    description: '',
    category: 'Footwear',
    price: '',
    discountPrice: '',
    deliveryCharge: '0',
    sizes: [],
    colors: [],
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products')
      setProducts(res.data.products)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const data = new FormData()
      data.append('retailHeading', formData.smallHeading)
      data.append('description', formData.description)
      data.append('category', formData.category)
      data.append('regularPrice', formData.price)
      data.append('discountPrice', formData.discountPrice)
      data.append('deliveryCharge', formData.deliveryCharge)
      
      formData.sizes.forEach(s => data.append('sizes', s))
      // Handle colors if implemented
      
      imageFiles.forEach(file => {
        if (file) data.append('images', file)
      })

      await api.post('/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setIsAdding(false)
      setFormData({
        smallHeading: '',
        description: '',
        category: 'Footwear',
        price: '',
        discountPrice: '',
        deliveryCharge: '0',
        sizes: [],
        colors: [],
      })
      setImageFiles([null, null, null, null])
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to list product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/api/products/${id}`)
      fetchProducts()
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }))
  }

  const handleFileChange = (index, file) => {
    const newFiles = [...imageFiles]
    newFiles[index] = file
    setImageFiles(newFiles)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-outfit font-black text-white">Elite Inventory</h2>
           <p className="text-white/50 text-sm">Manage your store products like an Amazon Pro.</p>
        </div>
        <button 
           onClick={() => setIsAdding(true)}
           className="bg-[#c9a962] text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#b09452] transition-colors shadow-lg shadow-[#c9a962]/20"
        >
           <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
            <div className="col-span-full py-20 flex justify-center">
               <Loader2 className="w-8 h-8 text-[#c9a962] animate-spin" />
            </div>
         ) : products.length === 0 ? (
            <div className="col-span-full py-20 glass rounded-3xl flex flex-col items-center justify-center border-dashed border-white/10">
               <Package className="w-12 h-12 text-white/10 mb-4" />
               <p className="text-white/30 font-bold uppercase tracking-widest text-xs">No Items in Inventory</p>
            </div>
         ) : (
            products.map(p => (
               <div key={p._id} className="glass rounded-2xl p-4 flex gap-4 border-white/5 group relative">
                  <img src={p.images?.[0] || 'https://via.placeholder.com/100'} className="w-20 h-20 rounded-lg object-cover bg-white/5" alt="" />
                  <div>
                     <h4 className="font-bold text-white text-sm line-clamp-1">{p.retailHeading}</h4>
                     <p className="text-[10px] text-[#c9a962] font-black uppercase tracking-wider">{p.category}</p>
                     <p className="text-xs font-bold text-white/50 mt-1">₹{(p.discountPrice || p.regularPrice)?.toLocaleString()}</p>
                  </div>
                  <button 
                     onClick={() => handleDelete(p._id)}
                     className="absolute top-2 right-2 p-1 text-white/20 hover:text-red-400 transition-colors"
                  >
                     <X className="w-4 h-4" />
                  </button>
               </div>
            ))
         )}
      </div>

      {/* Add Product Modal (Amazon Seller Style) */}
      <AnimatePresence>
         {isAdding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute inset-0 bg-black/90 backdrop-blur-md"
                  onClick={() => setIsAdding(false)}
               />
               <motion.form
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onSubmit={handleAddProduct}
                  className="relative w-full max-w-4xl bg-[#111112] border border-white/10 rounded-3xl shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
               >
                  {/* Header */}
                  <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c9a962] flex items-center justify-center">
                           <Layout className="w-5 h-5 text-black" />
                        </div>
                        <div>
                           <h3 className="text-xl font-outfit font-black text-white uppercase tracking-tight">Elite Seller Central</h3>
                           <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Inventory Management Tool v2.4</p>
                        </div>
                     </div>
                     <button type="button" onClick={() => setIsAdding(false)} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                     {/* Section 1: Identity */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <Type className="w-3 h-3" /> Small Heading
                           </label>
                           <input 
                              required
                              type="text" 
                              placeholder="e.g. Ultralight Pro V2"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                              value={formData.smallHeading}
                              onChange={e => setFormData({...formData, smallHeading: e.target.value})}
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <Package className="w-3 h-3" /> Category
                           </label>
                           <select 
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all appearance-none"
                              value={formData.category}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                           >
                              <option className="bg-[#111112]">Footwear</option>
                              <option className="bg-[#111112]">Apparel</option>
                              <option className="bg-[#111112]">Electronics</option>
                              <option className="bg-[#111112]">Beauty</option>
                              <option className="bg-[#111112]">Home</option>
                           </select>
                        </div>
                     </div>

                     {/* Section 2: Pricing */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <DollarSign className="w-3 h-3" /> Regular Price
                           </label>
                           <input 
                              required
                              type="number" 
                              placeholder="₹ 14,999"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                              value={formData.price}
                              onChange={e => setFormData({...formData, price: e.target.value})}
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <DollarSign className="w-3 h-3" /> Offer Price
                           </label>
                           <input 
                              type="number" 
                              placeholder="₹ 12,499"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                              value={formData.discountPrice}
                              onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <Truck className="w-3 h-3" /> Delivery Fee
                           </label>
                           <input 
                              type="number" 
                              placeholder="₹ 0"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all"
                              value={formData.deliveryCharge}
                              onChange={e => setFormData({...formData, deliveryCharge: e.target.value})}
                           />
                        </div>
                     </div>

                     {/* Section 3: Attributes */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <Maximize className="w-3 h-3" /> Standard Sizes
                           </label>
                           <div className="flex flex-wrap gap-2">
                              {['XS', 'S', 'M', 'L', 'XL', '8', '9', '10', '11'].map(size => (
                                 <button 
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest border transition-all ${
                                       formData.sizes.includes(size) 
                                          ? 'bg-[#c9a962] text-black border-[#c9a962]' 
                                          : 'bg-white/5 text-white/40 border-white/10 hover:border-[#c9a962]/50'
                                    }`}
                                 >
                                    {size}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                              <Palette className="w-3 h-3" /> Colors (Hex)
                           </label>
                           <div className="flex gap-2">
                              <input 
                                 type="text" 
                                 placeholder="#000000"
                                 className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all uppercase"
                              />
                              <button type="button" className="px-4 bg-[#c9a962] text-black rounded-xl font-bold text-xs uppercase transition-all hover:opacity-90">Add</button>
                           </div>
                        </div>
                     </div>

                     {/* Section 4: Media */}
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                           <Upload className="w-3 h-3" /> Multi-Image Carousel (4 slots)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {[0,1,2,3].map(i => (
                              <div key={i} className="space-y-2">
                                 <label className="aspect-square glass rounded-2xl flex flex-col items-center justify-center overflow-hidden border-dashed border-white/10 hover:border-[#c9a962]/40 cursor-pointer transition-all group">
                                    {imageFiles[i] ? (
                                       <img 
                                          src={URL.createObjectURL(imageFiles[i])} 
                                          className="w-full h-full object-cover" 
                                          alt=""
                                       />
                                    ) : (
                                       <>
                                          <Upload className="w-6 h-6 text-white/10 group-hover:text-[#c9a962]/60 transition-colors" />
                                          <span className="text-[8px] text-white/20 mt-2 font-bold uppercase">Slot {i+1}</span>
                                       </>
                                    )}
                                    <input 
                                       type="file" 
                                       accept="image/*"
                                       className="hidden" 
                                       onChange={e => handleFileChange(i, e.target.files[0])}
                                    />
                                 </label>
                                 <button 
                                    type="button"
                                    onClick={() => handleFileChange(i, null)}
                                    className={`w-full py-1 rounded text-[8px] font-bold uppercase transition-all ${imageFiles[i] ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'text-white/5 opacity-0 pointer-events-none'}`}
                                 >
                                    Remove
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Section 5: Description */}
                     <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-[#c9a962] uppercase tracking-widest">
                           <Type className="w-3 h-3" /> Detailed Description
                        </label>
                        <textarea 
                           rows={4}
                           placeholder="Describe the product in detail for Elite customers..."
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#c9a962]/50 outline-none transition-all resize-none"
                           value={formData.description}
                           onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                     </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-6 border-t border-white/5 bg-white/2 flex justify-end gap-3 shrink-0">
                     <button 
                        type="button" 
                        onClick={() => setIsAdding(false)}
                        className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                     >
                        Discard
                     </button>
                     <button 
                        type="submit"
                        disabled={submitting}
                        className="bg-[#c9a962] text-black font-black px-10 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#b09452] transition-colors shadow-xl shadow-[#c9a962]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {submitting ? (
                           <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Listing...
                           </>
                        ) : (
                           'List Product'
                        )}
                     </button>
                  </div>
               </motion.form>
            </div>
         )}
      </AnimatePresence>
    </div>
  )
}
