"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { authFetch } from "@/utils/authFetch"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { TrendingHeader } from "@/components/trending-header"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>
  }

  return (
    <div>
      <Navbar />
      <TrendingHeader />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-white">
      <Card className="w-full max-w-md shadow-xl animate-fade-in">
        <CardContent className="p-8 flex flex-col items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${profile.avatar || "/placeholder-user.jpg"}`}
            alt={profile.username}
            width={80}
            height={80}
            className="rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-1">{profile.full_name || profile.username}</h2>
          <div className="text-gray-500 mb-4">@{profile.username}</div>
          <Separator className="my-4"/>
          <div className="w-full space-y-2 text-center">
            <div><span className="font-medium">Email:</span>&nbsp;{profile.email}</div>
            <div><span className="font-medium">Phone:</span>&nbsp;{profile.phone}</div>
            <div>
              <span className="font-medium">Gender:</span>
              &nbsp;{profile.gender === 'F' ? 'Female' : 'Male'}
            </div>
        </div>
          <Button variant="outline" className="mt-6 w-full" asChild>
            <a href="/logout">Logout</a>
          </Button>
        </CardContent>
      </Card>
    </div>
    <Footer />
    </div>
  )
}