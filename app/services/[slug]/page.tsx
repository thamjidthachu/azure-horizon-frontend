"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, Calendar, Clock, Users, MapPin } from "lucide-react"
import { TrendingHeader } from "@/components/trending-header"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { useParams } from "next/navigation"
import { ReviewSection } from "@/components/ui/review-section"
import { authFetch } from "@/utils/authFetch"
import { useCart } from '@/components/cart-provider'
import { BookingConflictModal } from "@/components/booking-conflict-modal"
import { FavoriteButton } from "@/components/favorite-button"

export default function ServiceDetailPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const params = useParams<{ slug: string }>()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()
  const { addToCart, updateCartItem, cart, isLoading } = useCart()

  // Modal state
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [existingBookings, setExistingBookings] = useState<any[]>([])
  const [pendingBookingData, setPendingBookingData] = useState<{
    selectedDate: string
    selectedTime: string
    quantity: number
  } | null>(null)

  // Auto-set date and time for testing in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Set tomorrow's date for testing
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow.toISOString().split('T')[0])
      setSelectedTime('10:00 AM')
    }
  }, [])



  useEffect(() => {
    if (!params?.slug) return
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/services/${params.slug}/detail/`)
      .then(res => res.json())
      .then(data => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Service data from API:', data)
          console.log('Service keys:', Object.keys(data))
          console.log('Service ID fields:', { id: data.id, pk: data.pk, slug: data.slug })
        }

        // Show API messages in toast
        if (data.message) {
          toast({
            title: "Success",
            description: data.message,
            variant: "success"
          })
        }
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive"
          })
        }

        setService(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch service:', error)
        setLoading(false)

        // Try to show error message from API response
        if (error?.response?.data?.error) {
          toast({
            title: "Error",
            description: error.response.data.error,
            variant: "destructive"
          })
        } else if (error?.response?.data?.message) {
          toast({
            title: "Error",
            description: error.response.data.message,
            variant: "destructive"
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to load service details. Please try again.",
            variant: "destructive"
          })
        }
      })
  }, [params?.slug, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center gap-6">
        <span className="loader" aria-label="Loading service details" role="status" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading service details...</p>
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

  // Prepare images array
  const images: string[] = Array.isArray(service.files) && service.files.length > 0
    ? service.files.map((f: any) => f.images)
    : ["/placeholder.svg"];


  // Helper to convert 12-hour time (e.g., '09:00 AM') to 24-hour format ('09:00')
  function to24Hour(time12h: string) {
    if (!time12h) return '';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    let hoursNum = parseInt(hours, 10);
    if (modifier === 'PM' && hoursNum !== 12) {
      hoursNum += 12;
    }
    if (modifier === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }
    return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
  }

  const bookService = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    if (!selectedDate || !selectedTime) {
      setIsAddingToCart(false);
      toast({
        title: "Please select date and time",
        description: "Date and time selection is required for booking.",
        variant: "destructive"
      });
      return;
    }

    // Check for existing bookings of the same service
    const existingBookingsForService = cart?.items?.filter(item => item.service_id === service.id) || [];

    if (existingBookingsForService.length > 0) {
      // Show conflict modal
      const formattedExistingBookings = existingBookingsForService.map((item, index) => ({
        itemIndex: item.id,
        selectedDate: item.booking_date || '',
        selectedTime: item.booking_time || '',
        quantity: item.quantity
      }));

      setExistingBookings(formattedExistingBookings);
      setPendingBookingData({
        selectedDate,
        selectedTime,
        quantity
      });
      setShowConflictModal(true);
      setIsAddingToCart(false);
      return;
    }

    // No conflicts, add directly
    try {
      await addToCart({
        service_id: service.id,
        quantity,
        booking_date: selectedDate,
        booking_time: to24Hour(selectedTime)
      });
      // Success toast is now handled by cart provider
    } catch (error) {
      // Error toast is now handled by cart provider
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  }

  // Modal action handlers
  const handleCreateNew = async (bookingData: { selectedDate: string; selectedTime: string; quantity: number }) => {
    try {
      const response = await addToCart({
        service_id: service.id,
        quantity: bookingData.quantity,
        booking_date: bookingData.selectedDate,
        booking_time: to24Hour(bookingData.selectedTime)
      });

      // The addToCart function in cart-provider now handles showing API messages
      // No need to show additional toast here
    } catch (error) {
      // Error handling is done in cart-provider
    }
  };

  const handleAddToExisting = async (itemId: number, additionalQuantity: number) => {
    try {
      const existingItem = cart?.items?.find(item => item.id === itemId);
      if (existingItem) {
        const response = await updateCartItem(itemId, existingItem.quantity + additionalQuantity);
        // The updateCartItem function in cart-provider now handles showing API messages
      }
    } catch (error) {
      // Error handling is done in cart-provider
    }
  };

  const handleEditExisting = async (itemId: number, newBookingData: { selectedDate: string; selectedTime: string; quantity: number }) => {
    try {
      const response = await updateCartItem(itemId, newBookingData.quantity, newBookingData.selectedDate, to24Hour(newBookingData.selectedTime));
      // The updateCartItem function in cart-provider now handles showing API messages
    } catch (error) {
      // Error handling is done in cart-provider
    }
  };

  const handleModalClose = () => {
    setShowConflictModal(false);
    setExistingBookings([]);
    setPendingBookingData(null);
  };

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
          {/* Service Image Gallery */}
          <div className="space-y-4">
            {/* Desktop: Main Swiper with Thumbs */}
            <div className="hidden sm:block">
              <Swiper
                style={{ '--swiper-navigation-color': 'oklch(0.5 0.2 240)', '--swiper-pagination-color': 'oklch(0.5 0.2 240)' } as any}
                spaceBetween={10}
                navigation
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[Thumbs, Navigation, Pagination]}
                className="rounded-lg"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={service.name || `Service Image ${idx + 1}`}
                      className="w-full h-72 md:h-96 lg:h-[500px] object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Thumbnails */}
              {images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={Math.min(images.length, 6)}
                  watchSlidesProgress
                  slideToClickedSlide
                  modules={[Thumbs]}
                  className="mt-4 flex justify-center gap-2 lg:gap-4 lg:justify-start"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="!w-auto">
                      {() => {
                        // Use thumbsSwiper?.realIndex for robust highlight
                        // Swiper's realIndex can be undefined on first render, so fallback to Swiper's activeIndex
                        const activeIdx = (typeof thumbsSwiper?.realIndex === 'number' ? thumbsSwiper.realIndex : thumbsSwiper?.activeIndex) ?? 0;
                        const highlight = activeIdx === idx;
                        return (
                          <img
                            src={img}
                            alt={service.name || `Thumbnail ${idx + 1}`}
                            className={
                              `w-16 h-14 lg:w-24 lg:h-20 object-cover rounded-lg border-2 transition-all duration-200 cursor-pointer ` +
                              (highlight
                                ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl scale-105 z-10 bg-background'
                                : 'border-border opacity-70 hover:opacity-100')
                            }
                          />
                        );
                      }}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                {service.category || "Category"}
              </Badge>
            </div>
            {/* Mobile: Swiper with Pagination only */}
            <div className="block sm:hidden">
              <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="rounded-lg"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={service.name || `Service Image ${idx + 1}`}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
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
                      className={`h-5 w-5 ${i < Math.floor(service.rating ?? 0)
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
                  <Clock className="h-5 w-5 mr-2" />
                  {service.time || 0} hours
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Up to {service.max_people || 0} guests
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {service.location || "Location not specified"}
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Image src="/uae-dirham.svg" alt="AED" width={24} height={24} className="inline-block" />
                  {service.price ?? 0}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <span className="px-4 py-2 text-center min-w-[40px] sm:min-w-[60px]">{quantity}</span>
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
                disabled={isAddingToCart || isLoading}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-5 w-5 mr-2" />
                {isAddingToCart || isLoading ? 'Adding to Cart...' : (
                  <span className="flex items-center gap-2">
                    Add to Cart - <Image src="/uae-dirham.svg" alt="AED" width={16} height={16} className="inline-block" /> {(service.price ?? 0) * quantity}
                  </span>
                )}
              </Button>

              {/* Favorite Button */}
              <FavoriteButton
                serviceId={service.id}
                variant="compact"
                className="w-full"
                isFavorite={Boolean(service.is_favorite)}
              />
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


      <BookingConflictModal
        isOpen={showConflictModal}
        onClose={handleModalClose}
        onCreateNew={handleCreateNew}
        onAddToExisting={handleAddToExisting}
        onEditExisting={handleEditExisting}
        service={service}
        existingBookings={existingBookings}
        newBookingData={pendingBookingData}
      />

    </div>
  )
}




