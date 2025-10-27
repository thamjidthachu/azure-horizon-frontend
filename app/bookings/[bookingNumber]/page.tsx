"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  CreditCard, 
  ArrowLeft,
  Download,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useBooking } from '@/components/booking-provider'
import { useAuth } from '@/hooks/useAuth'
import { BookingAPIService, type Booking } from '@/lib/booking-api'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { state, getBookingDetail, cancelBooking, processPayment } = useBooking()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const bookingNumber = params.bookingNumber as string

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated && bookingNumber) {
      getBookingDetail(bookingNumber)
    }
  }, [isAuthenticated, bookingNumber])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view booking details.
              </p>
              <Link href={`/login?redirect=/bookings/${bookingNumber}`}>
                <Button size="lg">Log In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 rounded w-6"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const booking = state.currentBooking

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4"/>
              <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
              <p className="text-gray-600 mb-6">
                The booking you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/bookings">
                <Button>View All Bookings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleCancelBooking = async () => {
    try {
      const success = await cancelBooking(booking.booking_number, cancelReason)
      if (success) {
        setCancelReason('')
        toast({
          title: "Booking Cancelled",
          description: "Your booking has been cancelled successfully.",
        })
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const handlePayNow = async () => {
    try {
      await processPayment(booking.booking_number)
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    const statusInfo = BookingAPIService.formatBookingStatus(status)
    return statusInfo.color
  }

  const getPaymentStatusColor = (paymentStatus: string) => {
    const statusInfo = BookingAPIService.formatPaymentStatus(paymentStatus)
    return statusInfo.color
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2"/>
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Booking #{booking.booking_number}
            </h1>
            <p className="text-gray-600 mt-1">
              Created on {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {getStatusIcon(booking.status)}
                <div>
                  <p className="text-lg font-semibold">
                    {BookingAPIService.formatBookingStatus(booking.status).label}
                  </p>
                  <p className="text-gray-600 text-sm">Booking Status</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Badge 
                  variant="secondary"
                  className={`bg-${getStatusColor(booking.status)}-100 text-${getStatusColor(booking.status)}-800`}
                >
                  {BookingAPIService.formatBookingStatus(booking.status).label}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`bg-${getPaymentStatusColor(booking.payment_status)}-100 text-${getPaymentStatusColor(booking.payment_status)}-800`}
                >
                  {BookingAPIService.formatPaymentStatus(booking.payment_status).label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3"/>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {booking.booking_time && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3"/>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{booking.booking_time}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3"/>
                    <div>
                      <p className="text-sm text-gray-500">Number of Guests</p>
                      <p className="font-medium">{booking.number_of_guests}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{booking.guest_name}</p>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2"/>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{booking.guest_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2"/>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{booking.guest_phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {booking.services && booking.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Booked Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.services.map((service: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description || 'Premium resort service'}</p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                            <span>Quantity: {service.quantity}</span>
                            {service.selectedDate && (
                              <span>📅 {service.selectedDate}</span>
                            )}
                            {service.selectedTime && (
                              <span>🕒 {service.selectedTime}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(service.price * service.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${service.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            {booking.special_requests && (
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{booking.special_requests}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${booking.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vat:</span>
                    <span>${booking.vat.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span>${booking.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {booking.payment_status === 'unpaid' && (
                  <Button 
                    onClick={handlePayNow}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2"/>
                    Pay Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2"/>
                  Download Receipt
                </Button>

                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <X className="h-4 w-4 mr-2"/>
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Label htmlFor="cancelReason">Cancellation Reason (Optional)</Label>
                        <Textarea
                          id="cancelReason"
                          placeholder="Please let us know why you're cancelling..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCancelReason('')}>
                          Keep Booking
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleCancelBooking}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your booking? Our support team is here to help.
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}