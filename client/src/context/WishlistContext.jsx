import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'elite_wishlist'

const WishlistContext = createContext(null)

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.payload ?? []
    case 'TOGGLE': {
      const id = action.payload
      if (state.includes(id)) return state.filter((x) => x !== id)
      return [...state, id]
    }
    case 'ADD':
      return state.includes(action.payload) ? state : [...state, action.payload]
    case 'REMOVE':
      return state.filter((x) => x !== action.payload)
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const [ids, dispatch] = useReducer(wishlistReducer, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'LOAD', payload: JSON.parse(raw) })
    } catch (_) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch (_) {}
  }, [ids])

  const toggle = useCallback((id) => dispatch({ type: 'TOGGLE', payload: id }), [])
  const isLiked = useCallback((id) => ids.includes(id), [ids])

  return (
    <WishlistContext.Provider value={{ wishlistIds: ids, toggleWishlist: toggle, isLiked, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
