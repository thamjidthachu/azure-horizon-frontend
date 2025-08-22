"use client"

import { createContext, useContext, useEffect, useReducer, useState } from "react"

interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string | number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string | number; quantity: number } }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string | number) => void
  updateQuantity: (itemId: string | number, quantity: number) => void
  clearCart: () => void
  total: number
  dispatch: React.Dispatch<CartAction>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'paradise-resort-cart'

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload)

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      )

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [state, dispatch] = useReducer(cartReducer, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        parsedCart.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item })
        })
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, mounted])

  const addItem = (newItem: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: newItem })
  }

  const removeItem = (itemId: string | number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (itemId: string | number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const total = state.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value = {
    items: state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    dispatch
  }

  if (!mounted) {
    return (
      <CartContext.Provider value={{
        items: [],
        addItem: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        total: 0,
        dispatch: () => {}
      }}>
        {children}
      </CartContext.Provider>
    )
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
