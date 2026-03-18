import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import CartSidebar from './CartSidebar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 sm:pt-36">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </>
  )
}
