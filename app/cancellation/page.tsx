import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Calendar, CreditCard, Phone, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black dark:bg-black">
      <Navbar />
      <TrendingHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Cancellation Policy</h1>
          <p className="text-gray-600 dark:text-white">Understanding our flexible cancellation and refund policies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-teal-600 mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">24-Hour Free Cancellation</h3>
              <p className="text-gray-600">Cancel any booking up to 24 hours before for full refund</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">Flexible Rescheduling</h3>
              <p className="text-gray-600">Reschedule your services based on availability</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">Quick Refunds</h3>
              <p className="text-gray-600">Refunds processed within 3-5 business days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our concierge team is always available to help</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Cancellation Policy Overview</h2>
                <p className="mb-4">
                  At Azure Horizon, we understand that travel plans can change. Our flexible cancellation policy is designed to provide you with peace of mind while ensuring fair treatment for all our guests.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Service Cancellation Terms</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-600 mr-2"/>
                      <h4 className="font-semibold text-green-800">24+ Hours Before Service</h4>
                    </div>
                    <p className="text-green-700">
                      <strong>100% Refund:</strong> Cancel any service 24 hours or more before your scheduled time for a full refund to your original payment method.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2"/>
                      <h4 className="font-semibold text-yellow-800">12-24 Hours Before Service</h4>
                    </div>
                    <p className="text-yellow-700">
                      <strong>50% Refund:</strong> Cancellations made 12-24 hours before your service will receive a 50% refund. The remaining amount covers preparation costs.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-red-600 mr-2"/>
                      <h4 className="font-semibold text-red-800">Less Than 12 Hours</h4>
                    </div>
                    <p className="text-red-700">
                      <strong>No Refund:</strong> Cancellations made less than 12 hours before your service are non-refundable due to preparation and staffing commitments.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Special Circumstances</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Weather Conditions:</strong> Services cancelled due to severe weather receive full refunds or complimentary rescheduling</li>
                  <li><strong>Medical Emergencies:</strong> Documented medical emergencies may qualify for full refunds regardless of timing</li>
                  <li><strong>Resort Closure:</strong> If we must cancel services due to maintenance or other issues, full refunds are provided</li>
                  <li><strong>Flight Delays:</strong> Documented flight delays may qualify for flexible rescheduling options</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">How to Cancel Your Booking</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Online:</strong> Log into your account and manage your bookings</li>
                  <li><strong>Phone:</strong> Call our 24/7 concierge at +960 123-4567</li>
                  <li><strong>Email:</strong> Send your booking confirmation to cancellations@azurehorizon.com</li>
                  <li><strong>In-Person:</strong> Visit our front desk if you're already at the resort</li>
                </ol>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Refund Processing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds are processed to the original payment method within 3-5 business days</li>
                  <li>Credit card refunds may take 1-2 billing cycles to appear on your statement</li>
                  <li>International transactions may take additional time due to banking processes</li>
                  <li>You will receive email confirmation once your refund has been processed</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Rescheduling Options</h3>
                <p className="mb-4">
                  Instead of cancelling, consider rescheduling your services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free rescheduling available up to 24 hours before your service</li>
                  <li>Subject to availability and may require date/time adjustments</li>
                  <li>Seasonal rate differences may apply for rescheduled services</li>
                  <li>Our concierge team will help find the best alternative times</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Group Bookings</h3>
                <p className="mb-4">
                  Special terms apply to group bookings (5+ guests):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>48-hour cancellation notice required for full refund</li>
                  <li>Partial group cancellations may be accommodated</li>
                  <li>Custom cancellation terms may apply to large events</li>
                  <li>Contact our group coordinator for specific policies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Travel Insurance</h3>
                <p className="mb-4">
                  We strongly recommend purchasing travel insurance to protect your investment:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Covers unexpected cancellations due to illness, injury, or emergencies</li>
                  <li>May provide coverage for weather-related cancellations</li>
                  <li>Can protect against financial loss from trip interruptions</li>
                  <li>Our concierge can recommend trusted insurance providers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Questions or Concerns?</h3>
                <p className="mb-4">
                  Our guest services team is here to help with any questions about our cancellation policy or to assist with your specific situation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button>Contact Concierge</Button>
                  </Link>
                  <Button variant="outline">
                    Call +960 123-4567
                  </Button>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
