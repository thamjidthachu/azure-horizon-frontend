"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function TrendingHeader() {
  const [advertisingMessages, setAdvertisingMessages] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Fetch messages from API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/advertisement/`)
      .then((res) => res.json())
      .then((data) => {
        // Only keep active messages
        const active = data.filter((item: any) => item.is_active)
        setAdvertisingMessages(active)
      })
      .catch((err) => console.error("Failed to fetch advertisements:", err))
  }, [])

  // Rotate messages
  useEffect(() => {
    if (advertisingMessages.length === 0) return
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % advertisingMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [advertisingMessages])

  if (!isVisible || advertisingMessages.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 px-4 text-center relative">
      <div className="flex items-center justify-center">
        <p className="text-sm font-medium animate-pulse">
          {advertisingMessages[currentMessage]?.title}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:bg-white/20 rounded-full p-1"
        >
          <X className="h-4 w-4"/>
        </button>
      </div>
    </div>
  )
}
