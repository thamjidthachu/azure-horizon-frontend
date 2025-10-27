"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, Calendar, Loader2 } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useCart } from '@/components/cart-provider'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from "react"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const { 
    cart, 
    items, 
    isLoading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    subtotal,
    vat,
    total,
    itemCount
  } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
    } else {
      await updateCartItem(itemId, quantity)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    await removeFromCart(itemId)
  }

  const handleClearCart = async () => {
    await clearCart()
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

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <TrendingHeader />
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Calendar className="h-24 w-24 text-gray-400 mx-auto mb-4"/>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Please log in to view your cart and make bookings.
            </p>
            <Link href="/login">
              <Button size="lg">Login to Continue</Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  // Show loading state
  if (isLoading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <TrendingHeader />
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">Loading your cart...</h2>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <TrendingHeader />
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Calendar className="h-24 w-24 text-red-400 mx-auto mb-4"/>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Cart Error</h1>
            <p className="text-xl text-red-600 dark:text-red-400 mb-8">{error}</p>
            <Link href="/services">
              <Button size="lg">Browse Services</Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
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
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={
                        item.service_image && typeof item.service_image === 'string' && item.service_image.trim() && item.service_image !== 'null'
                          ? (item.service_image.startsWith('/media/')
                              ? `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${item.service_image}`
                              : item.service_image)
                          : "/placeholder.svg"
                      }
                      alt={item.service_name}
                      width={120}
                      height={120}
                      className="w-full sm:w-30 h-30 object-cover rounded-lg"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }}
                    />
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.service_name}</h3>
                        <p className="text-sm text-gray-500">
                          Duration: {item.service_duration || 'N/A'}
                        </p>
                        {item.booking_date && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            📅 {item.booking_date} {item.booking_time && `at ${item.booking_time}`}
                          </p>
                        )}
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${parseFloat(item.service_price).toFixed(2)} per service
                        </p>
                        <p className="text-sm text-gray-600">
                          Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4"/>
                          </Button>
                          <span className="px-4 py-2 text-center min-w-[60px]">
                            {item.quantity} guest{item.quantity > 1 ? 's' : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4"/>
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} service{itemCount !== 1 ? 's' : ''})</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vat (5%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg" disabled={isLoading || items.length === 0}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="w-full">
                      Add More Services
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={handleClearCart}
                    disabled={isLoading || items.length === 0}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
                    Clear Cart
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Your cart is saved across devices when logged in
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
