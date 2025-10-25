"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, Edit, Plus, X } from 'lucide-react'

interface ExistingBooking {
  itemIndex: number
  selectedDate: string
  selectedTime: string
  quantity: number
}

interface BookingConflictModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateNew: (bookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => void
  onAddToExisting: (itemIndex: number, additionalQuantity: number) => void
  onEditExisting: (itemIndex: number, newBookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  }) => void
  service: {
    name: string
    price?: number
  } | null
  existingBookings: ExistingBooking[]
  newBookingData: {
    selectedDate: string
    selectedTime: string
    quantity: number
  } | null
}

export function BookingConflictModal({ 
  isOpen, 
  onClose, 
  onCreateNew,
  onAddToExisting,
  onEditExisting,
  service, 
  existingBookings,
  newBookingData
}: BookingConflictModalProps) {
  const [selectedAction, setSelectedAction] = useState<'new' | 'add' | 'edit' | null>(null)
  const [selectedBookingIndex, setSelectedBookingIndex] = useState<number | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editQuantity, setEditQuantity] = useState(1)

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ]

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

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
    return `${formattedDate} at ${time}`
  }

  const handleConfirm = () => {
    if (!newBookingData) return

    switch (selectedAction) {
      case 'new':
        onCreateNew(newBookingData)
        break
      case 'add':
        if (selectedBookingIndex !== null) {
          onAddToExisting(selectedBookingIndex, newBookingData.quantity)
        }
        break
      case 'edit':
        if (selectedBookingIndex !== null && editDate && editTime) {
          onEditExisting(selectedBookingIndex, {
            selectedDate: editDate,
            selectedTime: editTime,
            quantity: editQuantity
          })
        }
        break
    }
    handleClose()
  }

  const handleClose = () => {
    setSelectedAction(null)
    setSelectedBookingIndex(null)
    setEditDate('')
    setEditTime('')
    setEditQuantity(1)
    onClose()
  }

  const handleActionChange = (action: 'new' | 'add' | 'edit') => {
    setSelectedAction(action)
    if (action === 'add' || action === 'edit') {
      // Pre-select first booking
      setSelectedBookingIndex(existingBookings[0]?.itemIndex || null)
      if (action === 'edit' && existingBookings[0]) {
        setEditDate(existingBookings[0].selectedDate)
        setEditTime(existingBookings[0].selectedTime)
        setEditQuantity(existingBookings[0].quantity)
      }
    }
  }

  const handleBookingSelection = (itemIndex: number) => {
    setSelectedBookingIndex(itemIndex)
    if (selectedAction === 'edit') {
      const booking = existingBookings.find(b => b.itemIndex === itemIndex)
      if (booking) {
        setEditDate(booking.selectedDate)
        setEditTime(booking.selectedTime)
        setEditQuantity(booking.quantity)
      }
    }
  }

  if (!service || !newBookingData) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            {service.name} - Booking Conflict
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* New booking info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">You're trying to add:</h4>
            <div className="text-sm text-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4" />
                {formatDateTime(newBookingData.selectedDate, newBookingData.selectedTime)}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {newBookingData.quantity} guest{newBookingData.quantity > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Existing bookings */}
          <div className="bg-amber-50 p-3 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Existing booking{existingBookings.length > 1 ? 's' : ''} in cart:</h4>
            <div className="space-y-2">
              {existingBookings.map((booking, index) => (
                <div key={booking.itemIndex} className="text-sm text-amber-800 bg-white p-2 rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    {formatDateTime(booking.selectedDate, booking.selectedTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {booking.quantity} guest{booking.quantity > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action selection */}
          <div className="space-y-3">
            <Label>What would you like to do?</Label>
            
            <div className="space-y-2">
              {/* Create new booking option */}
              <Button
                variant={selectedAction === 'new' ? 'default' : 'outline'}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleActionChange('new')}
              >
                <div className="flex items-start gap-3">
                  <Plus className="h-5 w-5 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Create separate booking</div>
                    <div className="text-xs text-muted-foreground">
                      Add as new item for {formatDateTime(newBookingData.selectedDate, newBookingData.selectedTime)}
                    </div>
                  </div>
                </div>
              </Button>

              {/* Add to existing booking */}
              <Button
                variant={selectedAction === 'add' ? 'default' : 'outline'}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleActionChange('add')}
              >
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Add to existing booking</div>
                    <div className="text-xs text-muted-foreground">
                      Increase guest count for existing booking
                    </div>
                  </div>
                </div>
              </Button>

              {/* Edit existing booking */}
              <Button
                variant={selectedAction === 'edit' ? 'default' : 'outline'}
                className="w-full justify-start h-auto p-3"
                onClick={() => handleActionChange('edit')}
              >
                <div className="flex items-start gap-3">
                  <Edit className="h-5 w-5 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Edit existing booking</div>
                    <div className="text-xs text-muted-foreground">
                      Change date/time of existing booking
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Sub-options for add/edit */}
          {(selectedAction === 'add' || selectedAction === 'edit') && existingBookings.length > 1 && (
            <div className="space-y-2">
              <Label>Select which booking:</Label>
              <Select 
                value={selectedBookingIndex?.toString() || ''} 
                onValueChange={(value) => handleBookingSelection(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose booking" />
                </SelectTrigger>
                <SelectContent>
                  {existingBookings.map((booking, index) => (
                    <SelectItem key={booking.itemIndex} value={booking.itemIndex.toString()}>
                      {formatDateTime(booking.selectedDate, booking.selectedTime)} - {booking.quantity} guest{booking.quantity > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Edit form */}
          {selectedAction === 'edit' && (
            <div className="space-y-3 border-t pt-3">
              <Label>Edit booking details:</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date</Label>
                  <Select value={editDate} onValueChange={setEditDate}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Date" />
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
                
                <div>
                  <Label className="text-xs">Time</Label>
                  <Select value={editTime} onValueChange={setEditTime}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Guests</Label>
                <div className="flex items-center border rounded-md w-fit">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                    disabled={editQuantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-3 py-1 text-sm min-w-[40px] text-center">{editQuantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditQuantity(Math.min(10, editQuantity + 1))}
                    disabled={editQuantity >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={
                !selectedAction || 
                (selectedAction !== 'new' && selectedBookingIndex === null) ||
                (selectedAction === 'edit' && (!editDate || !editTime))
              }
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}