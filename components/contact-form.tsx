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

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  preferredDates: string
  numberOfGuests: string
  message: string
}

interface FormErrors {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    preferredDates: '',
    numberOfGuests: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const { toast } = useToast()

  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    }

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts/new/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          ...(formData.preferredDates && { preferred_dates: formData.preferredDates }),
          ...(formData.numberOfGuests && { number_of_guests: parseInt(formData.numberOfGuests) }),
          message: formData.message
        })
      })

      if (response.ok) {
        let responseData: any = {}
        try {
          responseData = await response.json()
        } catch (error) {
          // If JSON parsing fails, use empty object
          responseData = {}
        }
        
        toast({
          title: "Message sent!",
          description: responseData.message || "Our concierge team will get back to you within 2 hours.",
          variant: "success",
        })
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          preferredDates: '',
          numberOfGuests: '',
          message: ''
        })
        setErrors({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        let errorData: any = {}
        try {
          errorData = await response.json()
        } catch (error) {
          // If JSON parsing fails, use empty object
          errorData = {}
        }
        
        toast({
          title: "Failed to send message",
          description: errorData.message || errorData.error || "Please try again later.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? "border-red-500 focus-visible:ring-red-500" : undefined}
              />
              {errors.firstName && (
                <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? "border-red-500 focus-visible:ring-red-500" : undefined}
              />
              {errors.lastName && (
                <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : undefined}
            />
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select 
              value={formData.subject}
              onValueChange={(value) => handleInputChange('subject', value)}
            >
              <SelectTrigger className={errors.subject ? "border-red-500 focus-visible:ring-red-500" : undefined}>
                <SelectValue placeholder="Select a subject"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New Booking Inquiry">New Booking Inquiry</SelectItem>
                <SelectItem value="Existing Booking">Existing Booking</SelectItem>
                <SelectItem value="Service Information">Service Information</SelectItem>
                <SelectItem value="Special Occasions">Special Occasions</SelectItem>
                <SelectItem value="Group Bookings">Group Bookings</SelectItem>
                <SelectItem value="Feedback">Feedback</SelectItem>
                <SelectItem value="Casual Enquiry">Casual Enquiry</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.subject && (
              <div className="text-red-500 text-xs mt-1">{errors.subject}</div>
            )}
          </div>

          <div>
            <Label htmlFor="dates">Preferred Dates (Optional)</Label>
            <Input 
              id="dates" 
              placeholder="e.g., March 15-20, 2025 to March 25, 2025"
              value={formData.preferredDates}
              onChange={(e) => handleInputChange('preferredDates', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="guests">Number of Guests (Optional)</Label>
            <Select 
              value={formData.numberOfGuests}
              onValueChange={(value) => handleInputChange('numberOfGuests', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of guests"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              rows={6} 
              placeholder="Tell us about your dream vacation or any special requests..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={errors.message ? "border-red-500 focus-visible:ring-red-500" : undefined}
            />
            {errors.message && (
              <div className="text-red-500 text-xs mt-1">{errors.message}</div>
            )}
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