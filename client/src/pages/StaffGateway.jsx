import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'

/**
 * Hidden staff gateway — no link in main store UI.
 * Access only via direct URL: /staff-gateway
 * Backend should enforce Staff role via JWT.
 */
export default function StaffGateway() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // MOCK LOGIN FOR HASAN
    if (email === 'hasan@elite.com' && password === 'elite123') {
       setTimeout(() => {
          localStorage.setItem('elite_staff_token', 'mock-token-hasan-123')
          window.location.href = '/staff/dashboard'
       }, 800)
       return
    }

    try {
      // TODO: POST /api/auth/staff-login with { email, password }
      // Expect JWT with role: 'Staff'; reject Customer tokens for admin routes
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message || 'Access denied.')
        return
      }
      if (data.token) {
        localStorage.setItem('elite_staff_token', data.token)
        window.location.href = '/staff/dashboard'
      }
    } catch (_) {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 font-jakarta">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white/70" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-xl text-white">
                Staff Gateway
              </h1>
              <p className="text-white/50 text-sm">
                Authorized access only
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]/50"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-white/70 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#c9a962]/50"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-white font-outfit font-semibold flex items-center justify-center gap-2 hover:bg-white/15 disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Verifying…' : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-white/40 text-xs">
            This area is not linked from the store. Backend must validate Staff role.
          </p>
        </div>
        <a
          href="/"
          className="block text-center text-white/50 hover:text-white/80 text-sm mt-6"
        >
          ← Back to store
        </a>
      </motion.div>
    </div>
  )
}
