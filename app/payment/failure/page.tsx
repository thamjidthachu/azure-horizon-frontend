"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { XCircle, CreditCard, ArrowLeft, AlertTriangle, HelpCircle, Phone } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { StripePaymentService } from '@/lib/stripe-payment'


function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<{
    bookingNumber?: string;
    error?: string;
  }>({});

  useEffect(() => {
    const details = StripePaymentService.handlePaymentFailure();
    setErrorDetails(details);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Failed</h1>
              <p className="text-gray-600">We're sorry, but your booking could not be processed at this time.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-red-900 mb-2">What happened?</h2>
              <p className="text-red-700 text-sm">
                {errorDetails.error ||
                  "Your payment was declined. This could be due to insufficient funds, an expired card, or your bank's security measures."}
              </p>
              {errorDetails.bookingNumber && (
                <p className="text-red-600 text-sm mt-2">Booking Reference: {errorDetails.bookingNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Check Payment Info</p>
                  <p className="text-sm text-gray-600">Verify card details</p>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <HelpCircle className="h-6 w-6 text-gray-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Need Help?</p>
                  <p className="text-sm text-gray-600">Contact our support</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Don't worry - your selected services are still in your cart. You can try again with a different payment method.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout">
                  <Button size="lg">Try Again</Button>
                </Link>
                <Link href="/cart">
                  <Button variant="outline" size="lg">Back to Cart</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact Support</Button>
                </Link>
              </div>
              <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium text-teal-800">24/7 Support Available</span>
                </div>
                <p className="text-sm text-teal-700">
                  Call us at +960 123-4567 for immediate assistance with your booking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense>
      <PaymentFailureContent />
    </Suspense>
  );
}
