"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { authFetch } from "@/utils/authFetch"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pen } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <Navbar />
      <TrendingHeader />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative h-48 bg-gradient-to-r from-cyan-500 to-blue-500">
          <Image
            src="/resort-hero.png"
            alt="Cover Photo"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          <Card className="overflow-hidden shadow-xl animate-fade-in">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-800">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-lg">
                    <AvatarImage
                      src={
                        profile?.avatar
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.avatar}`
                          : "/placeholder-user.jpg"
                      }
                      alt={profile?.username}
                    />
                    <AvatarFallback>
                      {profile?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mt-4">
                    {profile?.full_name || profile?.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{profile?.username}
                  </p>
                  <Button variant="outline" className="mt-6">
                    <Pen className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>
                <div className="w-full md:w-2/3 p-8">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </label>
                      <p className="mt-1 text-lg font-semibold">
                        {profile?.full_name || "Not Provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email Address
                      </label>
                      <p className="mt-1 text-lg font-semibold">
                        {profile?.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone Number
                      </label>
                      <p className="mt-1 text-lg font-semibold">
                        {profile?.phone || "Not Provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Gender
                      </label>
                      <p className="mt-1 text-lg font-semibold">
                        {profile?.gender === "F"
                          ? "Female"
                          : profile?.gender === "M"
                          ? "Male"
                          : "Not Specified"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button variant="destructive" asChild>
                      <a href="/logout">Logout</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
