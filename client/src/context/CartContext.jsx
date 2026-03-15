import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const TAX_RATE = 0.12
const DELIVERY_BASE = 99

function cartReducer(state, action) {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

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

  const subtotal = state.items.reduce((sum, i) => sum + (i.price ?? i.discountPrice ?? 0) * i.qty, 0)
  const tax = subtotal * TAX_RATE
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
