"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (bookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => void
  service: {
    name: string
    price?: number
    [key: string]: any
  } | null
}

export function BookingModal({ isOpen, onClose, onConfirm, service }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [quantity, setQuantity] = useState(1)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      return // Don't submit if date/time not selected
    }

    onConfirm({
      selectedDate,
      selectedTime,
      quantity
    })

    // Reset form
    setSelectedDate('')
    setSelectedTime('')
    setQuantity(1)
  }

  const handleClose = () => {
    // Reset form when closing
    setSelectedDate('')
    setSelectedTime('')
    setQuantity(1)
    onClose()
  }

  // Generate date options (today + next 30 days)
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      const displayDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
      dates.push({ value: dateString, label: displayDate })
    }
    
    return dates
  }

  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Book {service.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose date" />
              </SelectTrigger>
              <SelectContent>
                {generateDateOptions().map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 text-center min-w-[40px] sm:min-w-[60px] flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Price:</span>
              <span className="font-semibold text-lg text-teal-600">
                ${((service.price ?? 0) * quantity).toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${service.price ?? 0} × {quantity} guest{quantity > 1 ? 's' : ''}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}