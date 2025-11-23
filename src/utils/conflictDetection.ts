import { format } from 'date-fns'

export interface BookingSlot {
  id: string
  dentist: string
  date: string
  time: string
  duration?: number // in minutes, default 15
}

export interface ConflictCheck {
  hasConflict: boolean
  conflictingBookings: BookingSlot[]
  message: string
}

/**
 * Check if a new booking would conflict with existing bookings
 */
export const checkBookingConflict = (
  newBooking: BookingSlot,
  existingBookings: BookingSlot[]
): ConflictCheck => {
  const conflicts: BookingSlot[] = []
  
  // Filter bookings for the same dentist and date
  const sameDayBookings = existingBookings.filter(
    booking => 
      booking.dentist === newBooking.dentist &&
      booking.date === newBooking.date &&
      booking.id !== newBooking.id // Exclude the booking being checked (for reschedules)
  )

  const newStartTime = parseTime(newBooking.time)
  const newDuration = newBooking.duration || 15
  const newEndTime = newStartTime + newDuration

  sameDayBookings.forEach(booking => {
    const bookingStartTime = parseTime(booking.time)
    const bookingDuration = booking.duration || 15
    const bookingEndTime = bookingStartTime + bookingDuration

    // Check for overlap
    if (
      (newStartTime >= bookingStartTime && newStartTime < bookingEndTime) ||
      (newEndTime > bookingStartTime && newEndTime <= bookingEndTime) ||
      (newStartTime <= bookingStartTime && newEndTime >= bookingEndTime)
    ) {
      conflicts.push(booking)
    }
  })

  if (conflicts.length > 0) {
    const conflictTimes = conflicts.map(b => b.time).join(', ')
    return {
      hasConflict: true,
      conflictingBookings: conflicts,
      message: `Time slot conflicts with existing booking${conflicts.length > 1 ? 's' : ''} at ${conflictTimes}`
    }
  }

  return {
    hasConflict: false,
    conflictingBookings: [],
    message: 'No conflicts detected'
  }
}

/**
 * Parse time string (HH:mm) to minutes since midnight
 */
const parseTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Check if booking is in the past
 */
export const isPastBooking = (date: string, time: string): boolean => {
  const bookingDateTime = new Date(`${date}T${time}`)
  return bookingDateTime < new Date()
}

/**
 * Check if booking is too far in the future (e.g., more than 2 months)
 */
export const isTooFarInFuture = (date: string, maxMonths: number = 2): boolean => {
  const bookingDate = new Date(date)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + maxMonths)
  return bookingDate > maxDate
}

