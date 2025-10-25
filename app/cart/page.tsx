"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, Calendar } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useBooking } from '@/components/booking-provider'
import { useEffect, useState } from "react"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { state, dispatch } = useBooking()

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateQuantity = (itemIndex: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemIndex, quantity } })
  }

  const removeService = (itemIndex: number) => {
    dispatch({ type: 'REMOVE_SERVICE', payload: itemIndex })
  }

  if (!mounted) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <TrendingHeader />
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Calendar className="h-24 w-24 text-gray-400 mx-auto mb-4"/>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h1>
            <p className="text-gray-600 mb-8">Start exploring our services to create your perfect getaway</p>
            <Link href="/services">
              <Button size="lg">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <Card key={`${item.id}-${item.selectedDate}-${item.selectedTime}-${index}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="w-full sm:w-30 h-30 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-600">{item.category}</p>
                        <p className="text-sm text-gray-500">Duration: {item.duration}</p>
                        {item.selectedDate && (
                          <p className="text-sm text-teal-600">
                            📅 {item.selectedDate} at {item.selectedTime}
                          </p>
                        )}
                        <p className="text-xl font-bold text-teal-600">${item.price}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.itemIndex!, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <span className="px-4 py-2 text-center min-w-[60px]">
                            {item.quantity} guest{item.quantity > 1 ? 's' : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.itemIndex!, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeService(item.itemIndex!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} services)</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resort fee</span>
                    <span>${(state.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(state.total * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      ${(state.total + state.total * 0.1 + state.total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="w-full">
                      Add More Services
                    </Button>
                  </Link>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Free cancellation up to 24 hours before your booking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
