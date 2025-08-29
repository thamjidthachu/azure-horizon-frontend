"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Calendar, Clock, Users, MapPin } from "lucide-react"
import { TrendingHeader } from "@/components/trending-header"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useBooking } from "@/components/booking-provider"
import { useToast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation"
import { ReviewSection } from "@/components/ui/review-section"
import { authFetch } from "@/utils/authFetch"

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const { dispatch } = useBooking()
  const { toast } = useToast()

  useEffect(() => {
    if (!params?.slug) return
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${params.slug}/`)
      .then(res => res.json())
      .then(data => {
        setService(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params?.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <span>Loading...</span>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <span>Service not found.</span>
      </div>
    )
  }

  const bookService = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select date and time",
        description: "Date and time selection is required for booking.",
        variant: "destructive"
      })
      return
    }
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_SERVICE',
        payload: {
          ...service,
          selectedDate,
          selectedTime
        }
      })
    }
    toast({
      title: "Service booked!",
      description: `${quantity} ${service.name} booking added to your cart.`,
    })
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={service.files?.[0]?.images || "/placeholder.svg"}
                alt={service.name || "Service-Image"}
                width={600}
                height={400}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              <Badge className="absolute top-4 left-4 bg-teal-500 text-white">
                {service.category || "Category"}
              </Badge>
            </div>
          </div>
          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              <p className="mb-4 text-gray-700">{service.synopsis}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(service.rating ?? 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {service.rating} ({service.review_count} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-6 mb-6 text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2"/>
                  {service.time || 0} hours
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2"/>
                  Up to {service.max_people || 0} guests
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2"/>
                  {service.location || "Location not specified"}
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-teal-600">
                  ${service.price ?? 0}
                </span>
                <span className="text-lg text-gray-500">
                  per {service.unit || "unit"}
                </span>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div
                className="text-gray-600 leading-relaxed prose"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
            <Separator />
            {/* Booking Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Book This Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Select Time</Label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Choose time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Guests:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(4, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                onClick={bookService}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-5 w-5 mr-2"/>
                Book Now - ${service.price ?? 0 * quantity}
              </Button>
            </div>
            <Separator />
            {/* Service Info */}
            <div
                className="text-gray-600 leading-relaxed prose"
                dangerouslySetInnerHTML={{ __html: service.policy || "<p>No policy information available.</p>" }}
              />
          </div>
          <Separator /> 
          {/* Reviews Section */}
          <div id="reviews" className="mt-8">
  <h3 className="text-lg font-semibold mb-4">Rate this service</h3>
    <ReviewSection serviceSlug={service.slug} />
    </div>
    </div>
      </div>
      <Footer />
    </div>
  )
}