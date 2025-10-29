"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { BookingAPIService, type Booking } from '@/lib/booking-api'
import { useToast } from '@/components/ui/use-toast'

interface Service {
  id: string
  name: string
  price: number
  image: string
  category: string
  duration: string
  description: string
}

interface BookingItem extends Service {
  quantity: number
  selectedDate?: string
  selectedTime?: string
  itemIndex?: number // Unique identifier for items with same service but different dates/times
}

interface BookingState {
  items: BookingItem[]
  total: number
  // Add booking management state
  userBookings: Booking[]
  currentBooking?: Booking
  isLoading: boolean
  error?: string
}

type BookingAction = 
  | { type: 'ADD_SERVICE'; payload: Service & { selectedDate?: string; selectedTime?: string; quantity?: number } }
  | { type: 'ADD_SERVICE_WITH_QUANTITY'; payload: Service & { selectedDate?: string; selectedTime?: string; quantity: number } }
  | { type: 'ADD_TO_EXISTING_BOOKING'; payload: { itemIndex: number; additionalQuantity: number } }
  | { type: 'EDIT_EXISTING_BOOKING'; payload: { itemIndex: number; selectedDate: string; selectedTime: string; quantity: number } }
  | { type: 'REMOVE_SERVICE'; payload: number } // Now uses itemIndex
  | { type: 'UPDATE_QUANTITY'; payload: { itemIndex: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  // Add booking management actions
  | { type: 'SET_USER_BOOKINGS'; payload: Booking[] }
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'UPDATE_BOOKING'; payload: Booking }

interface BookingContextType {
  state: BookingState
  dispatch: React.Dispatch<BookingAction>
  // Add booking management methods
  createBooking: (bookingData: any) => Promise<Booking | null>
  getUserBookings: () => Promise<void>
  getBookingDetail: (bookingNumber: string) => Promise<void>
  cancelBooking: (bookingNumber: string, reason?: string) => Promise<boolean>
  processPayment: (bookingNumber: string) => Promise<void>
}

const BookingContext = createContext<BookingContextType | null>(null)

const initialState: BookingState = {
  items: [],
  total: 0,
  userBookings: [],
  isLoading: false,
  error: undefined
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'ADD_SERVICE': {
      // Debug logging for development
      const isDevelopment = process.env.NODE_ENV === 'development'
      if (isDevelopment) {
        console.log('🛒 ADD_SERVICE called with:', action.payload)
      }
      
      // E-commerce logic: Each service with different configurations is a separate cart item
      // Only increment if EXACT same service with EXACT same configuration exists
      
      const newServiceData = {
        id: action.payload.id,
        selectedDate: action.payload.selectedDate || undefined,
        selectedTime: action.payload.selectedTime || undefined
      }
      
      if (isDevelopment) {
        console.log('🔍 Looking for existing item with:', newServiceData)
      }
      
      // Find existing item with EXACT match (service ID + date + time must all match)
      const existingItemIndex = state.items.findIndex(item => {
        // CRITICAL: Service ID must match first
        const serviceIdMatch = item.id === newServiceData.id
        
        // Normalize dates and times for comparison
        const itemDate = item.selectedDate
        const newServiceDate = newServiceData.selectedDate  
        const itemTime = item.selectedTime
        const newServiceTime = newServiceData.selectedTime
        
        // Exact matching: both date and time must match exactly
        // null === null (listing page items)
        // '2024-12-25' === '2024-12-25' (detail page items with same date)
        // null !== '2024-12-25' (listing vs detail page - different items)
        const dateMatch = itemDate === newServiceDate
        const timeMatch = itemTime === newServiceTime
        
        const exactMatch = serviceIdMatch && dateMatch && timeMatch
        
        if (isDevelopment) {
          console.log(`🔎 Comparing cart item ${item.id} (${item.name}) with new service ${newServiceData.id}:`, {
            serviceIdMatch,
            dateMatch: `${itemDate} === ${newServiceDate} = ${dateMatch}`,
            timeMatch: `${itemTime} === ${newServiceTime} = ${timeMatch}`,
            exactMatch,
            cartItem: {
              id: item.id,
              name: item.name,
              date: itemDate,
              time: itemTime
            },
            newService: {
              id: newServiceData.id,
              date: newServiceDate,
              time: newServiceTime
            }
          })
        }
        
        return exactMatch
      })
      
      if (existingItemIndex !== -1) {
        // Exact match found - increment quantity
        if (isDevelopment) {
          console.log('✅ Found exact match at index', existingItemIndex, '- incrementing quantity')
        }
        const incrementBy = action.payload.quantity || 1
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + incrementBy
        }
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
      } else {
        // No exact match - add as new cart item
        if (isDevelopment) {
          console.log('🆕 No exact match found - adding as new cart item')
        }
        const itemIndex = Date.now() + Math.random() // Generate unique identifier
        const newItems = [...state.items, { 
          ...action.payload, 
          quantity: action.payload.quantity || 1,
          itemIndex,
          selectedDate: newServiceData.selectedDate,
          selectedTime: newServiceData.selectedTime
        }]
        
        if (isDevelopment) {
          console.log('🛒 Updated cart:', newItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            date: item.selectedDate,
            time: item.selectedTime
          })))
        }
        
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
      }
    }
    
    case 'ADD_SERVICE_WITH_QUANTITY': {
      const isDevelopment = process.env.NODE_ENV === 'development'
      const newServiceData = action.payload
      
      if (isDevelopment) {
        console.log('🛒 ADD_SERVICE_WITH_QUANTITY called with:', action.payload)
      }

      // Find existing item with EXACT match (service ID + date + time must all match)
      const existingItemIndex = state.items.findIndex(item => {
        const serviceIdMatch = item.id === newServiceData.id
        const dateMatch = (item.selectedDate || undefined) === (newServiceData.selectedDate || undefined)
        const timeMatch = (item.selectedTime || undefined) === (newServiceData.selectedTime || undefined)
        const exactMatch = serviceIdMatch && dateMatch && timeMatch
        
        if (isDevelopment) {
          console.log(`🔎 Comparing cart item ${item.id} (${item.name}) with new service ${newServiceData.id}:`, {
            serviceIdMatch,
            dateMatch,
            timeMatch,
            exactMatch
          })
        }
        
        return exactMatch
      })
      
      if (existingItemIndex !== -1) {
        // Exact match found - increment quantity by the selected amount
        if (isDevelopment) {
          console.log(`✅ Found exact match at index ${existingItemIndex} - incrementing quantity by ${newServiceData.quantity}`)
        }
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newServiceData.quantity
        }
        
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
      } else {
        // No exact match - add as new cart item with selected quantity
        if (isDevelopment) {
          console.log(`🆕 No exact match found - adding as new cart item with quantity ${newServiceData.quantity}`)
        }
        const itemIndex = Date.now() + Math.random()
        const newItems = [...state.items, { 
          ...action.payload, 
          quantity: newServiceData.quantity,
          itemIndex,
          selectedDate: newServiceData.selectedDate,
          selectedTime: newServiceData.selectedTime
        }]
        
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
      }
    }
    
    case 'REMOVE_SERVICE': {
      const newItems = state.items.filter(item => item.itemIndex !== action.payload)
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.itemIndex === action.payload.itemIndex
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }
    case 'ADD_TO_EXISTING_BOOKING': {
      const updatedItems = state.items.map(item =>
        item.itemIndex === action.payload.itemIndex
          ? { ...item, quantity: item.quantity + action.payload.additionalQuantity }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }
    
    case 'EDIT_EXISTING_BOOKING': {
      const updatedItems = state.items.map(item =>
        item.itemIndex === action.payload.itemIndex
          ? { 
              ...item, 
              selectedDate: action.payload.selectedDate,
              selectedTime: action.payload.selectedTime,
              quantity: action.payload.quantity
            }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }
    
    case 'CLEAR_CART':
      return { 
        ...state, 
        items: [], 
        total: 0 
      }
    case 'SET_USER_BOOKINGS':
      return {
        ...state,
        userBookings: action.payload,
        isLoading: false
      }
    case 'SET_CURRENT_BOOKING':
      return {
        ...state,
        currentBooking: action.payload,
        isLoading: false
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'UPDATE_BOOKING':
      return {
        ...state,
        currentBooking: action.payload,
        userBookings: state.userBookings.map(booking => 
          booking.booking_number === action.payload.booking_number 
            ? action.payload 
            : booking
        )
      }
    default:
      return state
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('azure_horizon_cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Clear localStorage first to avoid issues with old data format
        localStorage.removeItem('azure_horizon_cart')
        // Add items back with new structure
        parsedCart.forEach((item: BookingItem) => {
          dispatch({ type: 'ADD_SERVICE', payload: { ...item, quantity: item.quantity } })
        })
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
      // Clear corrupted localStorage
      localStorage.removeItem('azure_horizon_cart')
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('azure_horizon_cart', JSON.stringify(state.items))
    } else {
      localStorage.removeItem('azure_horizon_cart')
    }
  }, [state.items])

  // Create a new booking
  const createBooking = async (bookingData: any): Promise<Booking | null> => {
    console.log('🚀 BookingProvider.createBooking called with:', bookingData)
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      console.log('📡 About to call BookingAPIService.createBooking...')
      const response = await BookingAPIService.createBooking(bookingData)
      console.log('✅ BookingAPIService.createBooking response:', response)
      
      // Clear cart after successful booking
      dispatch({ type: 'CLEAR_CART' })
      
      toast({
        title: "Booking Created!",
        description: `Your booking ${response.booking.booking_number} has been created successfully.`,
        variant: "default"
      })

      return response.booking
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      })
      return null
    }
  }

  // Get user's bookings
  const getUserBookings = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await BookingAPIService.getMyBookings()
      dispatch({ type: 'SET_USER_BOOKINGS', payload: response.results })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Failed to Load Bookings",
        description: error.message || "Could not fetch your bookings.",
        variant: "destructive"
      })
    }
  }

  // Get booking details
  const getBookingDetail = async (bookingNumber: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const booking = await BookingAPIService.getBookingDetail(bookingNumber)
      dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Booking Not Found",
        description: error.message || "Could not find the requested booking.",
        variant: "destructive"
      })
    }
  }

  // Cancel a booking
  const cancelBooking = async (bookingNumber: string, reason?: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await BookingAPIService.cancelBooking(bookingNumber, reason)
      
      // Refresh booking data
      await getBookingDetail(bookingNumber)
      await getUserBookings()
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
        variant: "default"
      })
      
      return true
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }

  // Process payment for a booking
  const processPayment = async (bookingNumber: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // This will redirect to Stripe, so we don't need to handle the response
      const session = await BookingAPIService.createCheckoutSession(bookingNumber)
      
      // Redirect to Stripe Checkout
      if (session.session_url) {
        window.location.href = session.session_url
      } else {
        throw new Error('Invalid payment session')
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const contextValue: BookingContextType = {
    state,
    dispatch,
    createBooking,
    getUserBookings,
    getBookingDetail,
    cancelBooking,
    processPayment
  }

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
