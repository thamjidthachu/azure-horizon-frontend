"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { CreditCard, User, Calendar } from 'lucide-react'
import { TrendingHeader } from '@/components/trending-header'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useToast } from '@/components/ui/use-toast'
import { useCart } from '@/components/cart-provider'

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [mounted, setMounted] = useState(false)
  const { items, subtotal, total, vat, checkoutCart, isLoading } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart")
    }
  }, [items, router, mounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const customer_name = `${formData.get('firstName') as string} ${formData.get('lastName') as string}`
      const customer_email = formData.get('email') as string
      const customer_phone = formData.get('phone') as string
      const special_requests = formData.get('specialRequests') as string || undefined

      if (!customer_name.trim() || !customer_email || !customer_phone) {
        throw new Error('Please fill in all required guest information fields')
      }

      const order = await checkoutCart({ customer_name, customer_email, customer_phone, special_requests })
      // If backend returns a payment_url, redirect; otherwise, show success toast
      if (order && (order as any).payment_url) {
        window.location.href = (order as any).payment_url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process your booking. Please try again.",
        variant: "destructive"
      })
      setIsProcessing(false)
    }
  }

  // Show loading or placeholder during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <TrendingHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2"/>
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea id="specialRequests" name="specialRequests" placeholder="Any special requests or requirements..." rows={3} />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2"/>
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Secure Payment Processing</h3>
                    <p className="text-sm text-blue-700">
                      After confirming your booking details, you'll be redirected to our secure payment processor (Stripe) to complete your payment. We accept all major credit cards and digital payment methods.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <a href="/terms" className="text-blue-600 hover:underline">terms and conditions</a> and cancellation policy
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2"/>
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Booking Items */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${item.booking_date}-${item.booking_time}-${index}`} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.service_name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} guest{item.quantity > 1 ? 's' : ''}{item.service_duration ? ` • ${item.service_duration}` : ''}
                          </p>
                          {item.booking_date && (
                            <p className="text-sm text-teal-600">
                              📅 {item.booking_date}{item.booking_time ? ` at ${item.booking_time}` : ''}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">${(parseFloat(item.service_price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vat</span>
                      <span>${vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : `Complete Booking - $${total.toFixed(2)}`}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your booking information is secure and encrypted
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
