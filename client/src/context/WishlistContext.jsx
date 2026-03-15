import { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, items: action.payload }
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (exists) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    default:
      return state
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })
  const [hasFetched, setHasFetched] = useState(false)
  const isInitialMount = useRef(true)

  // 1. Sync FROM server on Login
  useEffect(() => {
    if (user) {
      setHasFetched(false)
      api.get('/api/user/sync')
        .then(res => {
          if (res.data.wishlist) {
            const mappedItems = res.data.wishlist.map(item => ({
              ...item,
              id: item._id
            }))
            dispatch({ type: 'SET_WISHLIST', payload: mappedItems })
          }
          setHasFetched(true)
        })
        .catch(err => {
          console.error('Failed to sync wishlist', err)
          setHasFetched(true)
        })
    } else {
      setHasFetched(false)
      dispatch({ type: 'SET_WISHLIST', payload: [] })
    }
  }, [user])

  // 2. Sync TO server on Change
  useEffect(() => {
    if (!user || !hasFetched) return

    const wishlistData = state.items.map(i => i._id || i.id)
    api.post('/api/user/wishlist', { wishlist: wishlistData })
      .catch(err => console.error('Failed to update remote wishlist', err))
  }, [state.items, user, hasFetched])

  const toggleWishlist = useCallback((item) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: item })
  }, [])

  const isLiked = useCallback((id) => {
    return state.items.some(i => i.id === id || i._id === id)
  }, [state.items])

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems: state.items, 
      toggleWishlist, 
      isLiked, 
      count: state.items.length 
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
