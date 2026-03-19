import { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const TAX_RATE = 0.12
const DELIVERY_BASE = 99

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload }
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, qty: i.qty + (action.payload.qty || 1) } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.payload) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((item, i) =>
          i === action.payload.index ? { ...item, qty: Math.max(1, action.payload.qty) } : item
        ),
      }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { 
    items: (() => {
      try {
        const local = localStorage.getItem('elite_cart')
        return local ? JSON.parse(local) : []
      } catch (e) {
        return []
      }
    })(), 
    isOpen: false 
  })
  const [hasFetched, setHasFetched] = useState(false)
  const prevUserRef = useRef(null)

  // 1. Sync FROM server on Login
  useEffect(() => {
    if (user) {
      setHasFetched(false)
      api.get('/api/user/sync')
        .then(res => {
          if (res.data.cart) {
            const mappedItems = res.data.cart.map(item => ({
              ...item.product,
              id: item.product._id,
              qty: item.qty,
              size: item.size,
              color: item.color
            }))
            dispatch({ type: 'SET_CART', payload: mappedItems })
          }
          setHasFetched(true)
        })
        .catch(err => {
          console.error('Failed to sync cart', err)
          setHasFetched(true)
        })
    } else if (prevUserRef.current && !user) {
      // ONLY clear cart if they were logged in and now they aren't (explicit logout)
      setHasFetched(false)
      dispatch({ type: 'SET_CART', payload: [] })
    }
    prevUserRef.current = user
  }, [user])

  // 2. Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('elite_cart', JSON.stringify(state.items))
  }, [state.items])

  // 3. Sync TO server on Change
  useEffect(() => {
    if (!user || !hasFetched) return

    const cartData = state.items.map(i => ({
      product: i._id || i.id,
      qty: i.qty,
      size: i.size,
      color: i.color
    }))
    
    api.post('/api/user/cart', { cart: cartData })
      .catch(err => console.error('Failed to update remote cart', err))
  }, [state.items, user, hasFetched])

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    dispatch({ type: 'OPEN_CART' })
  }, [])

  const removeFromCart = useCallback((index) => {
    dispatch({ type: 'REMOVE_ITEM', payload: index })
  }, [])

  const updateQty = useCallback((index, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { index, qty } })
  }, [])

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])

  const subtotal = state.items.reduce((sum, i) => sum + (Number(i.discountPrice) || Number(i.regularPrice) || Number(i.price) || 0) * i.qty, 0)
  const tax = state.items.reduce((sum, i) => {
    const price = (Number(i.discountPrice) || Number(i.regularPrice) || Number(i.price) || 0)
    const rate = (i.taxRate || 12) / 100
    return sum + (price * i.qty * rate)
  }, 0)
  const delivery = state.items.length > 0 ? DELIVERY_BASE : 0
  const total = subtotal + tax + delivery

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    addToCart,
    removeFromCart,
    updateQty,
    openCart,
    closeCart,
    toggleCart,
    subtotal,
    tax,
    delivery,
    total,
    count: state.items.reduce((c, i) => c + i.qty, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
