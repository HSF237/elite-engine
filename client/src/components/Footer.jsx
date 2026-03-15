import { ChevronUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-[#111112] text-white/70 border-t border-white/5">
      {/* Back to top */}
      <button 
        onClick={scrollToTop}
        className="w-full py-4 bg-[#1a1a1c] hover:bg-[#252527] transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white"
      >
        <ChevronUp className="w-4 h-4" /> Back to top
      </button>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
         <div className="flex flex-col gap-6">
            <h4 className="text-white font-outfit font-black text-lg uppercase tracking-wider">Elite Store</h4>
            <p className="text-sm leading-relaxed">The pinnacle of luxury shopping. Curated electronics, fashion, and home essentials delivered with elite precision.</p>
            <div className="flex gap-4">
               {['ig', 'tw', 'fb'].map(icon => (
                  <div key={icon} className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-[#c9a962] hover:text-black transition-all cursor-pointer">
                     <span className="text-[10px] font-black uppercase text-inherit">{icon}</span>
                  </div>
               ))}
            </div>
         </div>

         <div>
            <h4 className="text-white font-outfit font-black text-sm uppercase tracking-widest mb-6">Get to Know Us</h4>
            <ul className="flex flex-col gap-3 text-sm">
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">About Elite</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Careers</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Press Releases</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Elite Science</a></li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-outfit font-black text-sm uppercase tracking-widest mb-6">Connect with Us</h4>
            <ul className="flex flex-col gap-3 text-sm">
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Facebook</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Twitter</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Instagram</a></li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-outfit font-black text-sm uppercase tracking-widest mb-6">Let Us Help You</h4>
            <ul className="flex flex-col gap-3 text-sm">
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Your Account</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Returns Centre</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">100% Purchase Protection</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Elite App Download</a></li>
               <li><a href="#" className="hover:text-[#c9a962] hover:underline transition-all">Help</a></li>
            </ul>
         </div>
      </div>

      <div className="border-t border-white/5 py-8">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-outfit font-bold text-xl text-white">
               ELITE <span className="text-[#c9a962]">STORE</span>
            </div>
            <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest text-white/30">
               <a href="#">Conditions of Use</a>
               <a href="#">Privacy Notice</a>
               <a href="#">Elite Ads</a>
            </div>
            <p className="text-[10px] text-white/20 tracking-tighter uppercase">© 2024–2026, Elite Store, Inc. or its affiliates — Built by Muhammad Hasan</p>
         </div>
      </div>
    </footer>
  )
}
