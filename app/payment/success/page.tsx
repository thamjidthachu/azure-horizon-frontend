import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Calendar, MapPin, Phone } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function PaymentSuccessPage() {
  const bookingNumber = `RST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

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
              <p className="text-gray-600 mb-1">Booking Number: <span className="font-mono font-medium">{bookingNumber}</span></p>
              <p className="text-gray-600">Confirmation email sent to your registered email address</p>
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
                <MapPin className="h-6 w-6 text-blue-600 mr-3"/>
                <div className="text-left">
                  <p className="font-medium text-blue-900">Azure Horizon</p>
                  <p className="text-sm text-blue-600">Al-Reem Island, Abu Dhabi</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                We're excited to welcome you to Azure Horizon! Please arrive 15 minutes before your scheduled services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/services">
                  <Button variant="outline" size="lg">
                    Book More Services
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg">
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
