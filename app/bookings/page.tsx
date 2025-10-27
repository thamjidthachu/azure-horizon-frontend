"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CreditCard, 
  Eye, 
  Download,
  X
} from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// import { useBooking } from '@/components/booking-provider'
import { useAuth } from '@/hooks/useAuth'
import { BookingAPIService, type Booking } from '@/lib/booking-api'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function MyBookingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated && user) {
      setIsLoading(true)
      setError(null)
      import('@/lib/cart-api').then(({ CartAPIService }) => {
        CartAPIService.getUserOrders()
          .then((orders) => {
            setBookings(orders)
            setIsLoading(false)
          })
          .catch((err) => {
            setError(err.message)
            setIsLoading(false)
          })
      })
    }
  }, [isAuthenticated, user])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
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
                You need to be logged in to view your bookings.
              </p>
              <Link href="/login?redirect=/bookings">
                <Button size="lg">Log In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

// ...existing code...

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your Azure Horizon reservations</p>
          </div>
          <Link href="/services">
            <Button>Book New Service</Button>
          </Link>
        </div>

  {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
  ) : (!bookings || bookings.length === 0) ? (
          <Card className="text-center">
            <CardContent className="p-8">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Explore our services to create your perfect getaway!
              </p>
              <Link href="/services">
                <Button size="lg">Browse Services</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {(bookings || []).map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        Booking #{booking.booking_number}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Booked on {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
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
                </CardHeader>

                <CardContent className="p-6">
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3"/>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {new Date(booking.booking_date).toLocaleDateString()}
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
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">{booking.number_of_guests}</p>
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name: </span>
                        <span className="font-medium">{booking.guest_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email: </span>
                        <span className="font-medium">{booking.guest_email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone: </span>
                        <span className="font-medium">{booking.guest_phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  {booking.services && booking.services.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Services</h3>
                      <div className="space-y-2">
                        {booking.services.map((service: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {service.quantity}</p>
                            </div>
                            <p className="font-medium">${(service.price * service.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {booking.special_requests && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Special Requests</h3>
                      <p className="text-gray-700 p-3 bg-gray-50 rounded">{booking.special_requests}</p>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Payment Summary</h3>
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
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${booking.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end space-y-3">
                      <div className="flex gap-2">
                        <Link href={`/bookings/${booking.booking_number}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1"/>
                            View Details
                          </Button>
                        </Link>

                        {booking.payment_status === 'unpaid' && (
                          <Button 
                            onClick={() => handlePayNow(booking.booking_number)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CreditCard className="h-4 w-4 mr-1"/>
                            Pay Now
                          </Button>
                        )}
                      </div>

                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-1"/>
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel booking #{booking.booking_number}? This action cannot be undone.
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
                                onClick={() => confirmCancellation()}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

  {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}