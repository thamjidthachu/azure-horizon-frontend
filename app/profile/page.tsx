"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authFetch } from "@/utils/authFetch"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Youtube, Instagram, Music, Calendar, Eye, Heart, Share2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { BookingAPIService } from "@/lib/booking-api"

interface ProfileData {
  id: number
  avatar: string
  username: string
  full_name: string
  email: string
  phone: string
  gender: string
  is_active: boolean
}

interface Booking {
  booking_number: string
  booking_date: string
  booking_time?: string
  status: string
  payment_status: string
  total_price: string
  number_of_guests: number
  services?: any[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)

  useEffect(() => {
    // Fetch profile data
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Fetch bookings
    BookingAPIService.getMyBookings(1)
      .then(data => {
        setBookings(data.results.slice(0, 5)) // Get first 5 bookings
        setBookingsLoading(false)
      })
      .catch(() => setBookingsLoading(false))
  }, [])

  // Dummy data for collections
  const collections = [
    { id: 1, title: "Beach Resort", subtitle: "Luxury Stay", image: "/placeholder.svg", color: "bg-yellow-400" },
    { id: 2, title: "Spa Package", subtitle: "Wellness", image: "/placeholder.svg", color: "bg-purple-600" },
    { id: 3, title: "Adventure Tour", subtitle: "Outdoor", image: "/placeholder.svg", color: "bg-blue-500" },
    { id: 4, title: "Fine Dining", subtitle: "Culinary", image: "/placeholder.svg", color: "bg-gray-600" },
    { id: 5, title: "Yoga Retreat", subtitle: "Mindfulness", image: "/placeholder.svg", color: "bg-gray-700" },
    { id: 6, title: "Water Sports", subtitle: "Adventure", image: "/placeholder.svg", color: "bg-gray-800" },
    { id: 7, title: "Sunset Cruise", subtitle: "Romance", image: "/placeholder.svg", color: "bg-purple-700" },
    { id: 8, title: "Cooking Class", subtitle: "Experience", image: "/placeholder.svg", color: "bg-gray-500" },
    { id: 9, title: "Island Hopping", subtitle: "Exploration", image: "/placeholder.svg", color: "bg-teal-600" },
    { id: 10, title: "Massage Therapy", subtitle: "Relaxation", image: "/placeholder.svg", color: "bg-pink-500" },
  ]

  const getStatusColor = (status: string) => {
    const statusInfo = BookingAPIService.formatBookingStatus(status)
    return statusInfo.color
  }

  const getPaymentStatusColor = (status: string) => {
    const statusInfo = BookingAPIService.formatPaymentStatus(status)
    return statusInfo.color
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Navbar />
      <TrendingHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">View all your profile details here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Avatar Card */}
            <Card className="bg-card dark:bg-zinc-900 border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="w-48 h-48 rounded-full border-4 border-background dark:border-zinc-800">
                      <AvatarImage
                        src={profile?.avatar ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.avatar}` : "/placeholder.svg"}
                        alt={profile?.username || "User"}
                        className="object-cover"
                        style={{ imageRendering: 'auto' }}
                      />
                      <AvatarFallback className="text-4xl bg-muted">
                        {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mt-6 text-center">
                    {profile?.full_name || "Loading..."}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center">@{profile?.username || "user"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card className="bg-card dark:bg-zinc-900 border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Social Media</h3>
                <div className="flex gap-3">
                  <Button size="icon" variant="outline" className="rounded-full bg-red-600 hover:bg-red-700 border-0 text-white">
                    <Youtube className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 border-0 text-white">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full bg-black hover:bg-gray-900 border-0 text-white">
                    <Music className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bio & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Other Details Card */}
            <Card className="bg-card dark:bg-zinc-900 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Bio & other details</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${profile?.is_active ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></div>
                      <span className="text-sm text-muted-foreground">{profile?.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.full_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Username</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        @{profile?.username || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Email Address</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.email || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Account Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={`${profile?.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'} hover:bg-green-500/30 border-0`}>
                          {profile?.is_active ? 'Active Account' : 'Inactive Account'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-muted-foreground">Phone Number</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Gender</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">User ID</label>
                      <p className="text-base font-medium text-foreground mt-1">
                        #{profile?.id || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Member Type</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-base font-medium text-blue-400">Premium Member</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Bookings Card */}
            <Card className="bg-card dark:bg-zinc-900 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">My Recent Bookings</h3>
                  <Link href="/bookings">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      View All
                    </Button>
                  </Link>
                </div>

                {bookingsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-pulse">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded bg-muted"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                            <div className="h-3 bg-muted rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No bookings yet</p>
                    <Link href="/services">
                      <Button variant="outline" size="sm" className="mt-4">
                        Browse Services
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div key={booking.booking_number} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">Booking #{booking.booking_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                              {booking.booking_time && ` • ${booking.booking_time}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex flex-col items-end">
                            <Badge variant="secondary" className={`bg-${getStatusColor(booking.status)}-500/20 text-${getStatusColor(booking.status)}-400 border-0 mb-1`}>
                              {BookingAPIService.formatBookingStatus(booking.status).label}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">${booking.total_price}</span>
                          </div>
                          <Link href={`/bookings/${booking.booking_number}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Collection Card */}
            <Card className="bg-card dark:bg-zinc-900 border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Favorite Services</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {collections.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className={`aspect-square rounded-lg ${item.color} relative overflow-hidden mb-2`}>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
