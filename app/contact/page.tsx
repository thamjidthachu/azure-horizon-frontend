"use client"

import { Mail, Phone, MapPin, Clock, Waves } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import ContactForm from '@/components/contact-form'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-black">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Contact Azure Horizon</h1>
          <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
            Planning your perfect getaway? Our dedicated concierge team is here to help you create unforgettable memories.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-teal-600 mr-3"/>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-gray-600">info@azurehorizon.com</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-teal-600 mr-3"/>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-gray-600">+971 527627117</p>
                    <p className="text-sm text-gray-500">24/7 Concierge Service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-teal-600 mr-3"/>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-gray-600">
                      Al Reem Island<br />
                      Abu Dhabi, UAE
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-teal-600 mr-3"/>
                  <div>
                    <h3 className="font-semibold">Resort Hours</h3>
                    <p className="text-gray-600">
                      Check-in: 3:00 PM<br />
                      Check-out: 12:00 PM<br />
                      Concierge: 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Waves className="h-6 w-6 text-teal-600 mr-3"/>
                  <div>
                    <h3 className="font-semibold text-teal-800 dark:text-black">Getting Here</h3>
                    <p className="text-teal-700 text-sm dark:text-gray-400">
                      30-minute seaplane transfer from Malé International Airport
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
      <Toaster />
    </div>
  )
}
