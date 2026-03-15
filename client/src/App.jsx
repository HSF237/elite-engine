import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import StaffGateway from './pages/StaffGateway'
import StaffDashboard from './pages/StaffDashboard'

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Routes>
          {/* Store: entry point */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          {/* Hidden staff access — no link in main nav */}
          <Route path="/staff-gateway" element={<StaffGateway />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </WishlistProvider>
  )
}
