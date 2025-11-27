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
  CreditCard,
  Eye,
  X
} from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
// import { useBooking } from '@/components/booking-provider'
import { useAuth } from '@/hooks/useAuth'
import { BookingAPIService } from '@/lib/booking-api'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function MyBookingsPage() {
  // Redirect to payment page for the booking
  const handlePayNow = (bookingNumber: string) => {
    window.location.href = `/checkout?booking_number=${bookingNumber}`;
  };

  // Cancel the booking and update state
  const confirmCancellation = async (bookingNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { CartAPIService } = await import('@/lib/cart-api');
      await CartAPIService.cancelBooking(bookingNumber, cancelReason);
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_number === bookingNumber ? { ...b, status: 'cancelled' } : b
        )
      );
      toast({
        title: 'Booking Cancelled',
        description: `Booking #${bookingNumber} has been cancelled.`,
        variant: 'default',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking.');
      toast({
        title: 'Cancellation Failed',
        description: err.message || 'Failed to cancel booking.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setCancelReason('');
    }
  };
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [bookings, setBookings] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated && user) {
      setIsLoading(true)
      setError(null)
      BookingAPIService.getMyBookings(page)
        .then((data) => {
          setBookings(data.results)
          setCount(data.count)
          setNext(data.next)
          setPrevious(data.previous)
          setIsLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setIsLoading(false)
        })
    }
  }, [isAuthenticated, user, page])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
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
              <h1 className="text-2xl font-bold mb-4 dark:text-white">Please Log In</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your Azure Horizon reservations</p>
          </div>
          <Link href="/services">
            <Button>Book New Service</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse dark:bg-zinc-900">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (!bookings || bookings.length === 0) ? (
          <Card className="text-center dark:bg-zinc-900">
            <CardContent className="p-8">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
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
              <Card key={booking.id} className="overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold dark:text-white">
                        Booking #{booking.booking_number}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
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
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                        <p className="font-medium dark:text-white">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {booking.booking_time && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                          <p className="font-medium dark:text-white">{booking.booking_time}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                        <p className="font-medium dark:text-white">{booking.number_of_guests}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <Link href={`/bookings/${booking.booking_number}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    {booking.payment_status === 'unpaid' && (
                      <Button
                        onClick={() => handlePayNow(booking.booking_number)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay Now
                      </Button>
                    )}
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4 mr-1" />
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
                              onClick={() => confirmCancellation(booking.booking_number)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  {/* Pagination */}
                  {count > bookings.length && (
                    <div className="flex justify-center mt-8 gap-2">
                      <Button variant="outline" size="sm" disabled={!previous} onClick={() => setPage(page - 1)}>
                        Previous
                      </Button>
                      <span className="px-3 py-2 text-sm text-muted-foreground">Page {page}</span>
                      <Button variant="outline" size="sm" disabled={!next} onClick={() => setPage(page + 1)}>
                        Next
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="mt-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
