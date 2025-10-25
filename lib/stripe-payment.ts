// Stripe Payment Integration
// This utility handles Stripe payment processing on the frontend

import { BookingAPIService } from './booking-api'

export interface StripeConfig {
  publicKey?: string
}

export interface PaymentIntent {
  sessionId: string
  sessionUrl: string
  bookingNumber: string
  amount: number
}

export class StripePaymentService {
  private static stripe: any = null
  private static initialized = false

  /**
   * Initialize Stripe with public key
   * This should be called once in the app
   */
  static async initialize(config?: StripeConfig): Promise<void> {
    if (this.initialized) return

    try {
      // Check if Stripe is already loaded
      if (typeof window !== 'undefined' && (window as any).Stripe) {
        this.stripe = (window as any).Stripe(config?.publicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        this.initialized = true
        return
      }

      // Dynamically load Stripe.js if not already loaded
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = () => {
        if ((window as any).Stripe) {
          this.stripe = (window as any).Stripe(config?.publicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
          this.initialized = true
        }
      }
      document.head.appendChild(script)

      // Wait for script to load
      return new Promise((resolve, reject) => {
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Stripe.js'))
      })
    } catch (error) {
      console.error('Error initializing Stripe:', error)
      throw error
    }
  }

  /**
   * Create checkout session and redirect to Stripe
   */
  static async processPayment(
    bookingNumber: string,
    options?: {
      successUrl?: string
      cancelUrl?: string
    }
  ): Promise<void> {
    try {
      await this.ensureInitialized()

      // Create checkout session via backend
      const session = await BookingAPIService.createCheckoutSession(
        bookingNumber,
        options?.successUrl,
        options?.cancelUrl
      )

      // Redirect to Stripe Checkout
      if (this.stripe && session.session_url) {
        window.location.href = session.session_url
      } else {
        throw new Error('Stripe not initialized or invalid session URL')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      throw error
    }
  }

  /**
   * Redirect to Stripe Checkout with session ID
   */
  static async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      await this.ensureInitialized()

      const { error } = await this.stripe.redirectToCheckout({
        sessionId: sessionId
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      throw error
    }
  }

  /**
   * Verify payment status after redirect back from Stripe
   */
  static async verifyPayment(sessionId: string) {
    try {
      return await BookingAPIService.verifyPayment(sessionId)
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  /**
   * Get payment status for a booking
   */
  static async getPaymentStatus(bookingNumber: string) {
    try {
      return await BookingAPIService.getPaymentStatus(bookingNumber)
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw error
    }
  }

  /**
   * Format amount for display (convert cents to dollars)
   */
  static formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100) // Stripe amounts are in cents
  }

  /**
   * Ensure Stripe is initialized before use
   */
  private static async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
    
    if (!this.stripe) {
      throw new Error('Stripe failed to initialize')
    }
  }

  /**
   * Check if we're on the client side
   */
  static isClient(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Parse URL parameters for payment result
   */
  static parsePaymentResult(): {
    sessionId?: string
    bookingNumber?: string
    success?: boolean
    cancelled?: boolean
  } {
    if (!this.isClient()) return {}

    const urlParams = new URLSearchParams(window.location.search)
    
    return {
      sessionId: urlParams.get('session_id') || undefined,
      bookingNumber: urlParams.get('booking_number') || undefined,
      success: window.location.pathname.includes('/payment/success'),
      cancelled: window.location.pathname.includes('/payment/failure') || 
                window.location.pathname.includes('/payment/cancel')
    }
  }

  /**
   * Handle payment success redirect
   */
  static async handlePaymentSuccess(): Promise<any> {
    const { sessionId, bookingNumber } = this.parsePaymentResult()
    
    if (sessionId) {
      try {
        return await this.verifyPayment(sessionId)
      } catch (error) {
        console.error('Error handling payment success:', error)
        throw error
      }
    } else if (bookingNumber) {
      try {
        return await this.getPaymentStatus(bookingNumber)
      } catch (error) {
        console.error('Error getting payment status:', error)
        throw error
      }
    }

    throw new Error('No session ID or booking number found in URL')
  }

  /**
   * Handle payment failure/cancellation
   */
  static handlePaymentFailure(): {
    bookingNumber?: string
    error?: string
  } {
    const { bookingNumber } = this.parsePaymentResult()
    const urlParams = new URLSearchParams(window.location.search)
    
    return {
      bookingNumber,
      error: urlParams.get('error') || 'Payment was cancelled or failed'
    }
  }
}

// Export the class and interfaces