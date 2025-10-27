"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Calendar, Mail, Phone, Loader2 } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StripePaymentService } from '@/lib/stripe-payment'
import { useToast } from '@/components/ui/use-toast'
import { type Booking } from '@/lib/booking-api'


import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        const bookingNumber = searchParams.get('booking_number')

        if (!sessionId && !bookingNumber) {
          throw new Error('No payment session or booking information found')
        }

        if (sessionId) {
          // Verify payment with session ID
          const result = await StripePaymentService.verifyPayment(sessionId)
          if (result?.booking) {
            setBooking(result.booking)
            toast({
              title: "Payment Successful!",
              description: `Your booking ${result.booking.booking_number} has been confirmed.`,
              variant: "default"
            })
          } else {
            throw new Error('Payment verification failed')
          }
        } else if (bookingNumber) {
          // For bookingNumber, we need to fetch the booking details separately
          // This is a fallback - ideally we should always have session_id
          throw new Error('Payment session not found. Please check your booking status.')
        } else {
          throw new Error('No payment information found')
        }
      } catch (error: any) {
        console.error('Payment verification error:', error)
        setError(error.message)
        toast({
          title: "Payment Verification Failed",
          description: error.message || "Unable to verify your payment. Please contact support.",
          variant: "destructive"
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin"/>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Payment...
              </h1>
              <p className="text-gray-600">
                Please wait while we confirm your payment and booking details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center border-red-200">
            <CardContent className="p-8">
              <div className="text-red-500 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Verification Error
              </h1>
              <p className="text-gray-600 mb-6">
                {error || "We couldn't verify your payment. Please contact our support team for assistance."}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
                <Link href="/bookings">
                  <Button>View Bookings</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4"/>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600">
                Your Azure experience has been successfully booked. Get ready for an unforgettable getaway!
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Booking Details</h2>
              <p className="text-gray-600 mb-1">
                Booking Number: <span className="font-mono font-medium">{booking.booking_number}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Guest: <span className="font-medium">{booking.guest_name}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Date: <span className="font-medium">{new Date(booking.booking_date).toLocaleDateString()}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Total: <span className="font-medium">${booking.total_amount.toFixed(2)}</span>
              </p>
              <p className="text-gray-600">Confirmation email sent to {booking.guest_email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center justify-center p-4 bg-teal-50 rounded-lg">
                <Calendar className="h-6 w-6 text-teal-600 mr-3"/>
                <div className="text-left">
                  <p className="font-medium text-teal-900">Booking Confirmed</p>
                  <p className="text-sm text-teal-600">Your services are reserved</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600 mr-3"/>
                <div className="text-left">
                  <p className="font-medium text-blue-900">Confirmation Sent</p>
                  <p className="text-sm text-blue-600">Check your email for details</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                We're excited to welcome you to Azure Horizon! Please arrive 15 minutes before your scheduled services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/bookings/${booking.booking_number}`}>
                  <Button size="lg">
                    View Booking Details
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg">
                    Book More Services
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="h-5 w-5 text-yellow-600 mr-2"/>
                  <span className="font-medium text-yellow-800">Need Help?</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Contact our concierge at +960 123-4567 for any assistance or special requests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
