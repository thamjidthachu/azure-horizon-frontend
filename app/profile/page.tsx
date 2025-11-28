"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authFetch } from "@/utils/authFetch"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Youtube, Instagram, Music, Calendar, Eye, Pencil, Trash2, Upload, X, Save } from "lucide-react"
import Link from "next/link"
import { BookingAPIService, type Booking } from "@/lib/booking-api"
import { useToast } from "@/components/ui/use-toast"

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchBookings()
  }, [])

  const fetchProfile = () => {
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setEditedProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const fetchBookings = () => {
    BookingAPIService.getMyBookings(1)
      .then(data => {
        setBookings(data.results.slice(0, 5))
        setBookingsLoading(false)
      })
      .catch(() => setBookingsLoading(false))
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile)
      setAvatarFile(null)
      setAvatarPreview(null)
    }
    setIsEditing(!isEditing)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload immediately
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/avatar/`, {
          method: 'PATCH',
          body: formData,
        })

        if (response.ok) {
          toast({ title: "Avatar updated successfully" })
          fetchProfile()
          setAvatarFile(null)
        } else {
          throw new Error('Failed to update avatar')
        }
      } catch (error) {
        toast({ title: "Failed to update avatar", variant: "destructive" })
        setAvatarPreview(null) // Revert preview on error
      }
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/avatar/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: null }),
      })

      if (response.ok) {
        toast({ title: "Avatar deleted successfully" })
        fetchProfile()
        setAvatarPreview(null)
        setAvatarFile(null)
      }
    } catch (error) {
      toast({ title: "Failed to delete avatar", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()

      if (editedProfile) {
        formData.append('full_name', editedProfile.full_name)
        formData.append('phone', editedProfile.phone)
        formData.append('gender', editedProfile.gender)
      }

      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/profile/update/`, {
        method: 'PATCH',
        body: formData,
      })

      if (response.ok) {
        // Fetch fresh profile data to ensure everything is in sync
        await fetchProfile()
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
        toast({ title: "Profile updated successfully" })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({ title: "Failed to update profile", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

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
            <Card className="bg-card dark:bg-zinc-900 border-border overflow-hidden relative">
              <div className="h-32 relative w-full">
                <Image
                  src="/hero.jpg"
                  alt="Cover"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <CardContent className="p-6 pt-0 relative">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 rounded-full border-4 border-background dark:border-zinc-900 shadow-lg">
                      <AvatarImage
                        src={avatarPreview || (profile?.avatar ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.avatar}` : "/placeholder.svg")}
                        alt={profile?.username || "User"}
                        className="object-cover"
                        style={{ imageRendering: 'auto' }}
                      />
                      <AvatarFallback className="text-4xl bg-muted">
                        {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          {(profile?.avatar || avatarPreview) && (
                            <Button
                              size="icon"
                              variant="destructive"
                              className="rounded-full"
                              onClick={handleDeleteAvatar}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${profile?.is_active ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></div>
                      <span className="text-sm text-muted-foreground">{profile?.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleEditToggle}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                          <Save className="h-4 w-4 mr-1" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={handleEditToggle}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.full_name || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-base font-medium text-foreground mt-1">
                          {profile?.full_name || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Username</Label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.username || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Email Address</Label>
                      <p className="text-base font-medium text-foreground mt-1">
                        {profile?.email || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Account Status</Label>
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
                      <Label className="text-sm text-muted-foreground">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile?.phone || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-base font-medium text-foreground mt-1">
                          {profile?.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Gender</Label>
                      {isEditing ? (
                        <select
                          value={editedProfile?.gender || ''}
                          onChange={(e) => setEditedProfile(prev => prev ? { ...prev, gender: e.target.value } : null)}
                          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="">Select gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      ) : (
                        <p className="text-base font-medium text-foreground mt-1">
                          {profile?.gender === 'M' ? 'Male' : profile?.gender === 'F' ? 'Female' : 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Member Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-base font-medium text-blue-400">Active Member</span>
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
                            <span className="text-sm font-medium text-foreground flex items-center gap-1">
                              <Image src="/uae-dirham.svg" alt="AED" width={14} height={14} className="inline-block" />
                              {booking.total_amount}
                            </span>
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
            {/* <Card className="bg-card dark:bg-zinc-900 border-border">
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
            </Card> */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
