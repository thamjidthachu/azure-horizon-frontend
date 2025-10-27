// Booking API Service
// This service handles all booking-related API calls to the Django backend

import { authFetch } from '../utils/authFetch'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface BookingService {
  service_id: number
  quantity: number
  service_date?: string
  service_time?: string
}

export interface BookingData {
  guest_name: string
  guest_email: string
  guest_phone: string
  booking_date: string
  booking_time?: string
  number_of_guests: number
  special_requests?: string
  services: BookingService[]
}

export interface Booking {
  id: number
  booking_number: string
  guest_name: string
  guest_email: string
  guest_phone: string
  booking_date: string
  booking_time?: string
  number_of_guests: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded'
  subtotal: number
  vat: number
  total_amount: number
  special_requests?: string
  created_at: string
  updated_at: string
  services?: any[]
}

export interface PaymentSession {
  session_id: string
  session_url: string
  booking_number: string
  amount: number
  currency: string
}

export interface BookingResponse {
  booking: Booking
  message: string
}

export class BookingAPIService {
  /**
   * Create a new booking
   */
  static async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    try {
      const apiUrl = `${API_BASE_URL}/bookings/create/`
      console.log('📤 Booking API URL:', apiUrl)
      console.log('📤 API_BASE_URL:', API_BASE_URL)
      console.log('📤 Booking data being sent:', JSON.stringify(bookingData, null, 2))
      console.log('📋 Service IDs in request:', bookingData.services.map(s => ({ service_id: s.service_id, quantity: s.quantity })))
      
      const response = await authFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log('❌ Booking creation error response:', response.status, response.statusText)
        console.log('❌ Full error details:', JSON.stringify(errorData, null, 2))
        
        // Show service_id specific error if it exists
        if (errorData.details && errorData.details.services) {
          console.log('🔍 Service validation errors:', errorData.details.services)
        }
        
        throw new Error(errorData.error || errorData.message || `Failed to create booking: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  /**
   * Get user's bookings
   */
  static async getMyBookings(page: number = 1): Promise<{ bookings: Booking[], count: number, next: string | null, previous: string | null }> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/my-bookings/?page=${page}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw error
    }
  }

  /**
   * Get booking details by booking number
   */
  static async getBookingDetail(bookingNumber: string): Promise<Booking> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/${bookingNumber}/`)

      if (!response.ok) {
        throw new Error(`Failed to fetch booking: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching booking detail:', error)
      throw error
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingNumber: string, reason?: string): Promise<{ message: string }> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/${bookingNumber}/cancel/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancellation_reason: reason }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to cancel booking: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  }

  /**
   * Create Stripe checkout session for payment
   */
  static async createCheckoutSession(bookingNumber: string, successUrl?: string, cancelUrl?: string): Promise<PaymentSession> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/${bookingNumber}/create-checkout-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: successUrl || `${window.location.origin}/payment/success?booking_number=${bookingNumber}`,
          cancel_url: cancelUrl || `${window.location.origin}/payment/failure?booking_number=${bookingNumber}`
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to create checkout session: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  /**
   * Get payment status for a booking
   */
  static async getPaymentStatus(bookingNumber: string): Promise<{ payment_status: string, stripe_session_id?: string }> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/${bookingNumber}/payment-status/`)

      if (!response.ok) {
        throw new Error(`Failed to fetch payment status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching payment status:', error)
      throw error
    }
  }

  /**
   * Verify payment completion
   */
  static async verifyPayment(sessionId: string): Promise<{ booking: Booking, message: string }> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/verify-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to verify payment: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  /**
   * Update booking status (admin/staff only)
   */
  static async updateBookingStatus(
    bookingNumber: string, 
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<{ message: string }> {
    try {
      const response = await authFetch(`${API_BASE_URL}/bookings/${bookingNumber}/update-status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to update booking status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  /**
   * Helper method to format booking data from cart items
   */
  static formatBookingFromCart(
    cartItems: any[],
    guestInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
    },
    additionalInfo?: {
      specialRequests?: string
    }
  ): BookingData {
    console.log('🎯 BookingAPIService.formatBookingFromCart called with:')
    console.log('  📋 Cart items:', cartItems)
    console.log('  👤 Guest info:', guestInfo)
    console.log('  ℹ️ Additional info:', additionalInfo)
    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      throw new Error('No services selected for booking')
    }

    // Filter out invalid items
    const validItems = cartItems.filter(item => item && item.id)
    if (validItems.length === 0) {
      throw new Error('No valid services found in cart')
    }

    // Calculate the primary booking date from the first item with a date
    const primaryDate = validItems.find(item => item.selectedDate)?.selectedDate || new Date().toISOString().split('T')[0]
    
    // Calculate total guests from all items
    const totalGuests = validItems.reduce((sum, item) => sum + (item.quantity || 1), 0)

    // Helper function to convert 12-hour time to 24-hour format
    const convertTimeTo24Hour = (time12h: string): string => {
      if (!time12h) return '09:00'
      
      const [time, period] = time12h.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      
      if (period?.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (period?.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes || '00'}`
    }

    // Helper function to extract numeric ID from service
    const getServiceId = (item: any): number => {
      // First priority: check if we stored the service_id when adding to cart
      if (typeof item.service_id === 'number') {
        console.log(`✅ Using stored service_id: ${item.service_id} for service: ${item.name || item.slug}`)
        return item.service_id
      }
      
      // Log the item structure for debugging
      console.log('🔍 Looking for service ID in item:', {
        keys: Object.keys(item),
        id: item.id,
        service_id: item.service_id,
        slug: item.slug,
        name: item.name
      })
      
      // Check other possible numeric ID fields
      if (typeof item.id === 'number') {
        console.log(`✅ Using numeric item.id: ${item.id}`)
        return item.id
      }
      if (typeof item.pk === 'number') {
        console.log(`✅ Using item.pk: ${item.pk}`)
        return item.pk
      }
      
      // Try to parse string IDs
      if (typeof item.service_id === 'string' && !isNaN(Number(item.service_id))) {
        const parsed = Number(item.service_id)
        console.log(`✅ Parsed service_id string '${item.service_id}' to number: ${parsed}`)
        return parsed
      }
      if (typeof item.id === 'string' && !isNaN(Number(item.id))) {
        const parsed = Number(item.id)
        console.log(`✅ Parsed string item.id '${item.id}' to number: ${parsed}`)
        return parsed
      }
      
      // TEMPORARY FIX: Create a slug-to-ID mapping for common services
      const slugToIdMapping: { [key: string]: number } = {
        'couples-yoga-sessions': 1,
        'luxury-spa-treatment': 2,
        'sunset-dinner-cruise': 3,
        'water-sports-adventure': 4,
        'private-beach-cabana': 5,
        'wine-tasting-experience': 6,
        'helicopter-tour': 7,
        'cooking-class': 8
      }
      
      if (item.slug && slugToIdMapping[item.slug]) {
        const mappedId = slugToIdMapping[item.slug]
        console.log(`🗺️ Using slug-to-ID mapping: ${item.slug} → ${mappedId}`)
        return mappedId
      }
      
      if (item.id && slugToIdMapping[item.id]) {
        const mappedId = slugToIdMapping[item.id]
        console.log(`🗺️ Using id-to-ID mapping: ${item.id} → ${mappedId}`)
        return mappedId
      }
      
      // This should not happen with our new implementation
      console.error('❌ Could not find valid numeric service ID in cart item:', item)
      throw new Error(`Missing service_id in cart item. Item has keys: ${Object.keys(item).join(', ')}. Please ensure the backend API returns numeric service IDs or update the slug-to-ID mapping.`)
    }

    const primaryBookingTime = validItems.find(item => item.selectedTime)?.selectedTime || '09:00 AM'
    const convertedTime = convertTimeTo24Hour(primaryBookingTime)

    return {
      guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
      guest_email: guestInfo.email,
      guest_phone: guestInfo.phone,
      booking_date: primaryDate,
      booking_time: convertedTime,
      number_of_guests: totalGuests,
      special_requests: additionalInfo?.specialRequests || '',
      services: validItems.map(item => {
        const serviceId = getServiceId(item)
        const convertedTime = item.selectedTime ? convertTimeTo24Hour(item.selectedTime) : undefined
        
        const serviceData = {
          service_id: serviceId,
          quantity: item.quantity || 1,
          service_date: item.selectedDate || undefined,
          service_time: convertedTime
        }
        
        console.log(`📋 Mapping cart item to booking service:`, {
          cartItem: {
            name: item.name,
            id: item.id,
            service_id: item.service_id,
            selectedTime: item.selectedTime
          },
          bookingService: serviceData
        })
        
        return serviceData
      })
    }
  }

  /**
   * Helper method to calculate pricing
   */
  static calculatePricing(cartItems: any[]) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    const resortFee = subtotal * 0.10 // 10% resort fee
    const vat = subtotal * 0.08 // 8% vat
    const total = subtotal + resortFee + vat

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      resortFee: parseFloat(resortFee.toFixed(2)),
      vat: parseFloat(vat.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    }
  }

  /**
   * Helper method to format booking status for display
   */
  static formatBookingStatus(status: string): { label: string, color: string } {
    const statusMap = {
      pending: { label: 'Pending', color: 'yellow' },
      confirmed: { label: 'Confirmed', color: 'green' },
      in_progress: { label: 'In Progress', color: 'blue' },
      completed: { label: 'Completed', color: 'green' },
      cancelled: { label: 'Cancelled', color: 'red' }
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, color: 'gray' }
  }

  /**
   * Helper method to format payment status for display
   */
  static formatPaymentStatus(paymentStatus: string): { label: string, color: string } {
    const statusMap = {
      unpaid: { label: 'Unpaid', color: 'red' },
      partial: { label: 'Partial', color: 'yellow' },
      paid: { label: 'Paid', color: 'green' },
      refunded: { label: 'Refunded', color: 'blue' }
    }
    return statusMap[paymentStatus as keyof typeof statusMap] || { label: paymentStatus, color: 'gray' }
  }
}