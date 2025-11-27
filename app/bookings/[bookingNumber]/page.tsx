"use client"
import { DirhamIcon } from '@/components/ui/dirham-icon'

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
// import { useBooking } from '@/components/booking-provider'
import { useAuth } from '@/hooks/useAuth'
import { BookingAPIService } from '@/lib/booking-api'
import { useToast } from '@/components/ui/use-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'


export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const bookingNumber = params.bookingNumber as string;

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated && bookingNumber) {
      setIsLoading(true);
      BookingAPIService.getBookingDetail(bookingNumber)
        .then((data) => {
          setBooking(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, bookingNumber]);

  if (!mounted || authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 md:h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
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
              <Link href={`/login?redirect=/api/v1/bookings/${bookingNumber}`}>
                <Button size="lg">Log In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center dark:bg-zinc-900 dark:border-zinc-800">
            <CardContent className="p-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2 dark:text-white">Booking Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The booking you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/bookings">
                <Button>View All Bookings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Cancel booking handler (dummy for now)
  const handleCancelBooking = async () => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    });
  };

  // Pay now handler (dummy for now)
  const handlePayNow = async () => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };
  const getStatusColor = (status: string) => {
    const statusInfo = BookingAPIService.formatBookingStatus(status);
    return statusInfo.color;
  };
  const getPaymentStatusColor = (paymentStatus: string) => {
    const statusInfo = BookingAPIService.formatPaymentStatus(paymentStatus);
    return statusInfo.color;
  };

  // --- Trendy Booking Details UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-black dark:to-gray-900">
      <Navbar />
      <TrendingHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Booking #{booking.booking_number}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Created on {new Date(booking.created_at).toLocaleDateString()} &middot; Status: <span className={`inline-flex items-center gap-2 font-semibold text-${getStatusColor(booking.status)}-600 dark:text-${getStatusColor(booking.status)}-400`}>{getStatusIcon(booking.status)}{BookingAPIService.formatBookingStatus(booking.status).label}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking & Order Info */}
            <Card className="shadow-xl border-2 border-blue-100 dark:border-blue-900/30 dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="dark:text-white">Booking & Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booking Date</p>
                      <p className="font-medium dark:text-white">{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium dark:text-white">{booking.booking_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                      <p className="font-medium dark:text-white">{booking.number_of_guests}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium dark:text-white">{booking.order?.customer_email || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium dark:text-white">{booking.order?.customer_phone || ''}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Number</p>
                    <p className="font-medium dark:text-white">{booking.order?.order_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
                    <Badge className={`bg-${getStatusColor(booking.order?.status)}-100 text-${getStatusColor(booking.order?.status)}-800 dark:bg-${getStatusColor(booking.order?.status)}-900/30 dark:text-${getStatusColor(booking.order?.status)}-400`}>
                      {BookingAPIService.formatBookingStatus(booking.order?.status).label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                    <Badge className={`bg-${getPaymentStatusColor(booking.order?.payment_status)}-100 text-${getPaymentStatusColor(booking.order?.payment_status)}-800 dark:bg-${getPaymentStatusColor(booking.order?.payment_status)}-900/30 dark:text-${getPaymentStatusColor(booking.order?.payment_status)}-400`}>
                      {BookingAPIService.formatPaymentStatus(booking.order?.payment_status).label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                    <p className="font-medium dark:text-white">{booking.order?.order_date ? new Date(booking.order.order_date).toLocaleString() : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items (Services) */}
            {booking.order?.order_items && booking.order.order_items.length > 0 && (
              <Card className="shadow-lg border border-blue-100 dark:border-blue-900/30 dark:bg-zinc-900">
                <CardHeader>
                  <CardTitle className="dark:text-white">Booked Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.order.order_items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700">
                        <img src={item.service?.files?.[0]?.images} alt={item.service?.name} className="w-20 h-20 object-cover rounded-lg border dark:border-zinc-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg dark:text-white">{item.service?.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.service?.synopsis}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span className="flex items-center gap-1">Unit Price: <DirhamIcon className="h-4 w-4 inline-block align-text-bottom" />{item.unit_price}</span>
                            <span className="flex items-center gap-1">Total: <DirhamIcon className="h-4 w-4 inline-block align-text-bottom" />{item.total_price}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg text-blue-600 dark:text-blue-400 flex items-center gap-1"><DirhamIcon className="h-5 w-5 inline-block align-text-bottom" />{item.total_price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payments */}
            {booking.payments && booking.payments.length > 0 && (
              <Card className="shadow-lg border border-green-100 dark:border-green-900/30 dark:bg-zinc-900">
                <CardHeader>
                  <CardTitle className="dark:text-white">Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.payments.map((payment: any) => (
                      <div key={payment.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="font-medium dark:text-white">{payment.payment_method?.toUpperCase()}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{payment.notes}</div>
                        </div>
                        <div className="flex flex-col items-end mt-2 md:mt-0">
                          <span className="font-bold text-green-700 dark:text-green-400 text-lg flex items-center gap-1"><DirhamIcon className="h-5 w-5 inline-block align-text-bottom" />{payment.amount}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{payment.payment_status}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{payment.payment_date ? new Date(payment.payment_date).toLocaleString() : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            {booking.special_requests && (
              <Card className="shadow border border-yellow-100 dark:border-yellow-900/30 dark:bg-zinc-900">
                <CardHeader>
                  <CardTitle className="dark:text-white">Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-gray-700 dark:text-yellow-100">{booking.special_requests}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="shadow border-2 border-green-100 dark:border-green-900/30 dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="dark:text-white">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span className="flex items-center gap-1"><DirhamIcon className="h-4 w-4 inline-block align-text-bottom" />{booking.order?.subtotal || '0.00'}</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>Tax:</span>
                    <span className="flex items-center gap-1"><DirhamIcon className="h-4 w-4 inline-block align-text-bottom" />{booking.order?.tax || '0.00'}</span>
                  </div>
                  <Separator className="dark:bg-zinc-700" />
                  <div className="flex justify-between font-bold text-base dark:text-white">
                    <span>Total:</span>
                    <span className="flex items-center gap-1"><DirhamIcon className="h-5 w-5 inline-block align-text-bottom" />{booking.order?.total_amount || '0.00'}</span>
                  </div>
                </div>

                {booking.order?.payment_status === 'unpaid' && (
                  <Button onClick={handlePayNow} className="w-full bg-green-600 hover:bg-green-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow border border-gray-200 dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="dark:text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>

                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="dark:bg-zinc-900 dark:border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-white">Cancel Booking</AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-400">
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Label htmlFor="cancelReason" className="dark:text-gray-300">Cancellation Reason (Optional)</Label>
                        <Textarea
                          id="cancelReason"
                          placeholder="Please let us know why you're cancelling..."
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          className="mt-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCancelReason('')} className="dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
                          Keep Booking
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                          Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow border border-blue-200 dark:border-blue-900/30 dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="dark:text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Have questions about your booking? Our support team is here to help.
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
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
  );
}
