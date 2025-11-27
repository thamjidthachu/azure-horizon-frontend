
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

export interface CartApiResponse {
  cart: Cart | null
  message?: string
  error?: string
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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/orders/${bookingNumber}/cancel/`, {
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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/get-my-cart/`)

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
  }): Promise<CartApiResponse> {
    console.log('🛒 CartAPI: Adding item to cart:', serviceData)

    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/add-to-cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('❌ CartAPI: Add to cart failed:', response.status, responseData)
        const errMsg = responseData.error || responseData.message || responseData.messege || responseData.detail || `Failed to add to cart: ${response.status}`
        return {
          cart: null,
          error: errMsg
        }
      }

      // Backend may return either the raw cart or a wrapper { message/messege, data }
      const cartPayload = responseData?.data ?? responseData
      const msg = responseData?.message || responseData?.messege || (responseData?.data && (responseData.data.message || responseData.data.messege))

      console.log('✅ CartAPI: Item added to cart:', cartPayload)
      return {
        cart: cartPayload,
        message: msg,
        error: responseData.error
      }
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
  ): Promise<CartApiResponse> {
    console.log('🛒 CartAPI: Updating cart item:', { itemId, quantity, booking_date, booking_time })
    try {
      const body: any = { quantity }
      if (booking_date !== undefined) body.booking_date = booking_date
      if (booking_time !== undefined) body.booking_time = booking_time
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/items/${itemId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('❌ CartAPI: Update cart item failed:', response.status, responseData)
        const errMsg = responseData.error || responseData.message || responseData.detail || `Failed to update cart item: ${response.status}`
        return {
          cart: null,
          error: errMsg
        }
      }

      const cartPayload = responseData?.data ?? responseData
      const msg = responseData?.message || responseData?.messege || (responseData?.data && (responseData.data.message || responseData.data.messege))

      console.log('✅ CartAPI: Cart item updated:', cartPayload)
      return {
        cart: cartPayload,
        message: msg,
        error: responseData.error
      }
    } catch (error: any) {
      console.error('❌ CartAPI: Error updating cart item:', error)
      throw new Error(`Failed to update cart item: ${error.message}`)
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(itemId: number): Promise<CartApiResponse> {
    console.log('🛒 CartAPI: Removing item from cart:', itemId)

    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/items/${itemId}/remove/`, {
        method: 'DELETE'
      })

      // Some DELETE endpoints return an empty body (204) or non-JSON body.
      // Safely read text first and try to parse JSON only if present to avoid
      // `Unexpected end of JSON input` errors.
      const text = await response.text()
      let responseData: any = {}
      if (text) {
        try {
          responseData = JSON.parse(text)
        } catch (parseErr) {
          // If parsing fails, log it and keep responseData as empty object
          console.warn('⚠️ CartAPI: removeFromCart returned non-JSON response:', parseErr)
          responseData = {}
        }
      }

      if (!response.ok) {
        console.error('❌ CartAPI: Remove from cart failed:', response.status, responseData)
        return {
          cart: null,
          error: responseData.error || responseData.message || responseData.detail || `Failed to remove from cart: ${response.status}`
        }
      }

      const cartPayload = (responseData && Object.keys(responseData).length > 0) ? (responseData?.data ?? responseData) : null
      const msg = responseData?.message || responseData?.messege || (responseData?.data && (responseData.data.message || responseData.data.messege))

      console.log('✅ CartAPI: Item removed from cart:', cartPayload)
      return {
        cart: cartPayload,
        message: msg,
        error: responseData.error
      }
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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/clear-cart/`, {
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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/checkout/`, {
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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/orders/`)

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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/orders/${orderId}/`)

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
      const response = await authFetch(`${API_BASE_URL}/api/v1/cart/orders/${orderId}/complete-payment/`, {
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