"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBooking } from '@/components/booking-provider'

export function HotReloadTest() {
  const [count, setCount] = useState(0)
  const router = useRouter()
  const { state } = useBooking()
  
  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 w-48">
      <h3 className="text-sm font-bold mb-2">✅ Hot Reload Active</h3>
      <p className="text-xs mb-2">Clicks: {count}</p>
      <p className="text-xs mb-2">Cart Items: {state.items.length}</p>
      <div className="space-y-2">
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-white text-green-600 px-2 py-1 rounded text-xs font-medium w-full"
        >
          Test Counter
        </button>
        <button 
          onClick={() => router.push('/services')}
          className="bg-white text-green-600 px-2 py-1 rounded text-xs font-medium w-full"
        >
          Test Services
        </button>
        <button 
          onClick={() => router.push('/cart')}
          className="bg-white text-green-600 px-2 py-1 rounded text-xs font-medium w-full"
        >
          Test Cart
        </button>
      </div>
      <p className="text-xs mt-2 opacity-75">� All systems go!</p>
    </div>
  )
}
