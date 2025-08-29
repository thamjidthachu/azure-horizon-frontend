"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palmtree } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Message sent!",
        description: "Our concierge team will get back to you within 2 hours.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palmtree className="h-5 w-5 mr-2 text-teal-600"/>
          Send us a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" required />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" required />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel"/>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking">New Booking Inquiry</SelectItem>
                <SelectItem value="existing">Existing Booking</SelectItem>
                <SelectItem value="services">Service Information</SelectItem>
                <SelectItem value="special">Special Occasions</SelectItem>
                <SelectItem value="group">Group Bookings</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dates">Preferred Dates (Optional)</Label>
            <Input id="dates" placeholder="e.g., March 15-20, 2024"/>
          </div>

          <div>
            <Label htmlFor="guests">Number of Guests (Optional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select number of guests"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5+">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              rows={6} 
              placeholder="Tell us about your dream vacation or any special requests..."
              required 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Our concierge team typically responds within 2 hours during business hours
          </p>
        </form>
      </CardContent>
    </Card>
  )
}