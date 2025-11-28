"use client"

import { authFetch } from "@/utils/authFetch"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Calendar, Clock } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/components/cart-provider'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { BookingModal } from '@/components/booking-modal'
import { BookingConflictModal } from '@/components/booking-conflict-modal'

interface ServiceFile {
  id: number
  images: string
}

interface Service {
  id: number // Add the numeric ID field
  slug: string
  name: string
  synopsis: string
  category?: string
  rating?: number
  review_count?: number
  time?: number
  price?: number
  unit?: string
  files?: ServiceFile[]
}

export default function ServicesPage() {
  // Helper to convert 12-hour time (e.g., '10:00 AM') to 24-hour format ('10:00')
  function to24Hour(time12h: string): string {
    if (!time12h) return '09:00';
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    if (period?.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes || '00'}`;
  }
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false)
  const [conflictData, setConflictData] = useState<{
    existingBookings: Array<{
      itemIndex: number
      selectedDate: string
      selectedTime: string
      quantity: number
    }>
    newBookingData: {
      selectedDate: string
      selectedTime: string
      quantity: number
    }
  } | null>(null)
  const { addToCart, items: cartItems, updateCartItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/list/`
        console.log('🌐 Attempting to fetch services from:', apiUrl)
        console.log('🔧 API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)

        // First test if the API is reachable
        try {
          const testRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/`)
          console.log('🔍 Backend API health check:', testRes.status)
        } catch (testError) {
          console.error('❌ Backend API not reachable:', testError)
          throw new Error('Backend API server is not running or not accessible')
        }

        const res = await authFetch(apiUrl)
        console.log('📡 Services API response status:', res.status, res.statusText)

        if (!res.ok) throw new Error('Failed to fetch services')
        const data = await res.json()
        console.log('📊 Services API response:', data)

        if (process.env.NODE_ENV === 'development' && data.length > 0) {
          console.log('🏨 First service from list API:', data[0])
          console.log('🔍 Service keys:', Object.keys(data[0]))
          console.log('🆔 Service ID fields:', { id: data[0].id, pk: data[0].pk, slug: data[0].slug })
        }

        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services')
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [toast])

  // Get categories only if services exist
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))]

  // Only filter and sort if we have services
  const filteredServices = services
    .filter(service => filterBy === 'all' || service.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price ?? 0) - (b.price ?? 0)
        case 'price-high':
          return (b.price ?? 0) - (a.price ?? 0)
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleQuickBook = (service: any) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleModalConfirm = (bookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => {
    if (!selectedService) return

    // Check if this service already exists in cart (API-based)
    const existingBookings = cartItems
      .filter(item => item.service_id === selectedService.id)
      .map(item => ({
        itemIndex: item.id, // Use cart item id from backend
        selectedDate: item.booking_date || '',
        selectedTime: item.booking_time || '',
        quantity: item.quantity
      }))

    if (existingBookings.length > 0) {
      // Conflict detected - show conflict resolution modal
      setConflictData({
        existingBookings,
        newBookingData: bookingData
      })
      setIsConflictModalOpen(true)
      setIsModalOpen(false)
      return
    }

    // No conflict - proceed with normal addition
    addServiceToCart(bookingData)
  }

  const addServiceToCart = async (bookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => {
    if (!selectedService) return

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add services to your cart.",
        variant: "destructive"
      })
      return
    }

    // Prepare cart data for API
    const cartData = {
      service_id: Number(selectedService.id), // Ensure numeric
      quantity: bookingData.quantity,
      booking_date: bookingData.selectedDate,
      booking_time: to24Hour(bookingData.selectedTime)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🏨 Services page adding service to cart via API:', {
        original: selectedService,
        cartData,
        bookingData
      })
    }

    // Use the cart API to add the item
    await addToCart(cartData)

    // Close modals on success (addToCart will handle error toasts)
    setIsModalOpen(false)
    setSelectedService(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  const handleConflictCreateNew = (bookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => {
    addServiceToCart(bookingData)
    setIsConflictModalOpen(false)
    setConflictData(null)
  }

  const handleConflictAddToExisting = (itemIndex: number, additionalQuantity: number) => {
    // Update the cart item quantity using the API
    const cartItem = cartItems.find(item => item.id === itemIndex)
    if (cartItem) {
      updateCartItem(itemIndex, cartItem.quantity + additionalQuantity)
      toast({
        title: "Added to existing booking",
        description: `${additionalQuantity} guest${additionalQuantity > 1 ? 's' : ''} added to your existing booking.`,
      })
    }
    setIsConflictModalOpen(false)
    setConflictData(null)
    setSelectedService(null)
  }

  const handleConflictEditExisting = (itemIndex: number, newBookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => {
    updateCartItem(
      itemIndex,
      newBookingData.quantity,
      newBookingData.selectedDate,
      to24Hour(newBookingData.selectedTime)
    )
    toast({
      title: "Booking updated",
      description: `Booking updated to ${newBookingData.selectedDate} at ${newBookingData.selectedTime} for ${newBookingData.quantity} guest${newBookingData.quantity > 1 ? 's' : ''}.`,
    })
    setIsConflictModalOpen(false)
    setConflictData(null)
    setSelectedService(null)
  }

  const handleConflictClose = () => {
    setIsConflictModalOpen(false)
    setConflictData(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <TrendingHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {error}
          </h2>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-background">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Resort Services</h1>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category || "all"}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.slug} className="group hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <Image
                    src={service.files?.[0]?.images || "/placeholder.svg"}
                    alt={service.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {service.category && (
                    <Badge className="absolute top-2 left-2 bg-teal-500">
                      {service.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition-colors">
                  {service.name}
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const isFilled = i < Math.floor(service.rating ?? 0)
                      return (
                        <Star
                          key={i}
                          className={
                            'h-4 w-4 ' + (isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300')
                          }
                        />
                      )
                    })}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({service.review_count ?? 20})</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {service.time ?? 0} hours
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.synopsis}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-teal-600 flex items-center gap-1">
                      <Image src="/uae-dirham.svg" alt="AED" width={18} height={18} className="inline-block" />
                      {service.price ?? 0}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {service.unit ?? 'per unit'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/services/${service.slug}`}>
                    <div className="w-full flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Link>
                  <Button
                    onClick={() => handleQuickBook(service)}
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        service={selectedService}
      />

      {/* Booking Conflict Modal */}
      <BookingConflictModal
        isOpen={isConflictModalOpen}
        onClose={handleConflictClose}
        onCreateNew={handleConflictCreateNew}
        onAddToExisting={handleConflictAddToExisting}
        onEditExisting={handleConflictEditExisting}
        service={selectedService}
        existingBookings={conflictData?.existingBookings || []}
        newBookingData={conflictData?.newBookingData || null}
      />
    </div>
  )
}
