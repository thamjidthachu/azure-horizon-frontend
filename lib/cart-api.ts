
import { authFetch } from '@/utils/authFetch'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'


export interface CartItem {
  id: number
  service_id: number
  service_name: string
  service_price: string
  quantity: number
  booking_date?: string
  booking_time?: string
  subtotal: string
  // Additional service details
  service_slug?: string
  service_image?: string
  service_duration?: string
  service_description?: string
}

export interface Cart {
  id: number
  user: number
  created_at: string
  updated_at: string
  is_active: boolean
  subtotal: string
  vat: string
  total: string
  items: CartItem[]
}

export interface OrderItem {
  id: number
  service_id: number
  service_name: string
  service_price: string
  quantity: number
  booking_date?: string
  booking_time?: string
  subtotal: string
}

export interface OrderDetail {
  id: number
  user: number
  cart: number
  order_number: string
  created_at: string
  updated_at: string
  subtotal: string
  vat: string
  total: string
  status: 'pending' | 'completed' | 'cancelled'
  payment_completed: boolean
  items: OrderItem[]
}

export class CartAPIService {

  /**
   * Cancel a booking by booking number
   */
  static async cancelBooking(bookingNumber: string, reason?: string): Promise<any> {
    console.log('🛒 CartAPI: Cancelling booking:', bookingNumber, reason)
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/orders/${bookingNumber}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to cancel booking: ${response.status}`)
      }
      const result = await response.json()
      console.log('✅ CartAPI: Booking cancelled:', result)
      return result
    } catch (error: any) {
      console.error('❌ CartAPI: Error cancelling booking:', error)
      throw new Error(`Failed to cancel booking: ${error.message}`)
    }
  }
  /**
   * Get or create active cart for the current user
   */
  static async getActiveCart(): Promise<Cart> {
    console.log('🛒 CartAPI: Getting active cart...')
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/active/`)
      
      if (!response.ok) {
        throw new Error(`Failed to get active cart: ${response.status} ${response.statusText}`)
      }
      
      const cart = await response.json()
      console.log('✅ CartAPI: Active cart retrieved:', cart)
      return cart
    } catch (error: any) {
      console.error('❌ CartAPI: Error getting active cart:', error)
      throw new Error(`Failed to get active cart: ${error.message}`)
    }
  }

  /**
   * Add item to cart
   */
  static async addToCart(serviceData: {
    service_id: number
    quantity: number
    booking_date?: string
    booking_time?: string
  }): Promise<Cart> {
    console.log('🛒 CartAPI: Adding item to cart:', serviceData)
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ CartAPI: Add to cart failed:', response.status, errorData)
        throw new Error(errorData.detail || errorData.error || `Failed to add to cart: ${response.status}`)
      }
      
      const cart = await response.json()
      console.log('✅ CartAPI: Item added to cart:', cart)
      return cart
    } catch (error: any) {
      console.error('❌ CartAPI: Error adding to cart:', error)
      throw new Error(`Failed to add to cart: ${error.message}`)
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(
    itemId: number,
    quantity: number,
    booking_date?: string,
    booking_time?: string
  ): Promise<CartItem> {
    console.log('🛒 CartAPI: Updating cart item:', { itemId, quantity, booking_date, booking_time })
    try {
      const body: any = { quantity }
      if (booking_date !== undefined) body.booking_date = booking_date
      if (booking_time !== undefined) body.booking_time = booking_time
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/items/${itemId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to update cart item: ${response.status}`)
      }
      const cartItem = await response.json()
      console.log('✅ CartAPI: Cart item updated:', cartItem)
      return cartItem
    } catch (error: any) {
      console.error('❌ CartAPI: Error updating cart item:', error)
      throw new Error(`Failed to update cart item: ${error.message}`)
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(itemId: number): Promise<{ message: string }> {
    console.log('🛒 CartAPI: Removing item from cart:', itemId)
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/items/${itemId}/remove/`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to remove from cart: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ CartAPI: Item removed from cart:', result)
      return result
    } catch (error: any) {
      console.error('❌ CartAPI: Error removing from cart:', error)
      throw new Error(`Failed to remove from cart: ${error.message}`)
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart(): Promise<{ message: string }> {
    console.log('🛒 CartAPI: Clearing cart...')
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/clear/`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to clear cart: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('✅ CartAPI: Cart cleared:', result)
      return result
    } catch (error: any) {
      console.error('❌ CartAPI: Error clearing cart:', error)
      throw new Error(`Failed to clear cart: ${error.message}`)
    }
  }

  /**
   * Checkout cart and create order
   */
  static async checkoutCart(guestInfo: {
    customer_name: string
    customer_email: string
    customer_phone: string
    special_requests?: string
  }): Promise<OrderDetail> {
    console.log('🛒 CartAPI: Checking out cart:', guestInfo)
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/cart/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guestInfo)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ CartAPI: Checkout failed:', response.status, errorData)
        throw new Error(errorData.detail || errorData.error || `Failed to checkout: ${response.status}`)
      }
      
      const order = await response.json()
      console.log('✅ CartAPI: Cart checked out successfully:', order)
      return order
    } catch (error: any) {
      console.error('❌ CartAPI: Error during checkout:', error)
      throw new Error(`Failed to checkout: ${error.message}`)
    }
  }

  /**
   * Get user's orders
   */
  static async getUserOrders(): Promise<OrderDetail[]> {
    console.log('🛒 CartAPI: Getting user orders...')
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/orders/`)
      
      if (!response.ok) {
        throw new Error(`Failed to get orders: ${response.status} ${response.statusText}`)
      }
      
      const orders = await response.json()
      console.log('✅ CartAPI: User orders retrieved:', orders)
      return orders
    } catch (error: any) {
      console.error('❌ CartAPI: Error getting orders:', error)
      throw new Error(`Failed to get orders: ${error.message}`)
    }
  }

  /**
   * Get order details
   */
  static async getOrderDetail(orderId: number): Promise<OrderDetail> {
    console.log('🛒 CartAPI: Getting order detail:', orderId)
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/orders/${orderId}/`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to get order: ${response.status}`)
      }
      
      const order = await response.json()
      console.log('✅ CartAPI: Order detail retrieved:', order)
      return order
    } catch (error: any) {
      console.error('❌ CartAPI: Error getting order detail:', error)
      throw new Error(`Failed to get order detail: ${error.message}`)
    }
  }

  /**
   * Complete payment for order
   */
  static async completePayment(orderId: number, paymentData?: any): Promise<OrderDetail> {
    console.log('🛒 CartAPI: Completing payment for order:', orderId)
    
    try {
      const response = await authFetch(`${API_BASE_URL}/api/cart/orders/${orderId}/complete-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData || {})
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.error || `Failed to complete payment: ${response.status}`)
      }
      
      const order = await response.json()
      console.log('✅ CartAPI: Payment completed successfully:', order)
      return order
    } catch (error: any) {
      console.error('❌ CartAPI: Error completing payment:', error)
      throw new Error(`Failed to complete payment: ${error.message}`)
    }
  }
}