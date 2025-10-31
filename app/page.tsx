"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TrendingHeader } from "@/components/trending-header"
import { Sparkles, Utensils, Waves } from "lucide-react"
import { authFetch } from "@/utils/authFetch"


type Service = {
  id: number
  name: string
  slug: string
  synopsis: string
  description: string
  create_time: string
  files?: { id: number; images: string }[]
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/`)
        if (!res.ok) throw new Error('Failed to fetch services')
        const data = await res.json()
        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <TrendingHeader />
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Azure Horizon"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Beyond rest, into peace.
            </h1>
            <p className="text-xl mb-8 text-white/95 drop-shadow-md">
              Discover harmony and elegance at Azure Horizon.
              From peaceful retreats surrounded by nature to indulgent luxury experiences,
              every moment is designed to refresh your soul.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Book Now
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="w-full text-gray-700 hover:text-teal-600">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-teal-600"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Luxury Spa</h3>
              <p className="text-gray-600">
                World-class spa treatments and wellness experiences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-teal-600"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fine Dining</h3>
              <p className="text-gray-600">
                Gourmet cuisine with ocean views and sunset dining
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-teal-600"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">Water Adventures</h3>
              <p className="text-gray-600">
                Exciting water sports and island exploration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-background dark:bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
              Our Top Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular experiences designed to create
              unforgettable memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <Card key={`skeleton-${index}`} className="group">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-3 text-center text-gray-600">
                {error}
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-3 text-center text-gray-600">
                No services available at the moment.
              </div>
            ) : (
              services.map((service) => (
                <Card
                  key={service.id}
                  className="group hover:shadow-lg transition-shadow dark:bg-gray-900"
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <img
                        src={
                          service.files && service.files[0]?.images
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${service.files[0].images}`
                            : "/placeholder.svg"
                        }
                        alt={service.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-teal-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600">{service.synopsis}</p>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground  shadow-sm bg-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Azure Experience?
          </h2>
          <p className="text-xl mb-8 text-teal-100">
            Book your dream vacation today and create memories that will last a
            lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button variant="outline" className="w-full text-gray-700 hover:text-teal-600">
                  Book Services
                </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full text-gray-700 hover:text-teal-600">
                  Contact Us
                </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}
