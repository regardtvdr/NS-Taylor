import { useState, useEffect, useCallback } from 'react'
import { bookingsServiceMethods } from '../services/bookingsService'
import { BookingDetail } from '../types'
import { useToast } from '../contexts/ToastContext'

export const useBookings = () => {
  const [bookings, setBookings] = useState<BookingDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await bookingsServiceMethods.getAll()
      setBookings(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const createBooking = useCallback(async (booking: Partial<BookingDetail>) => {
    try {
      const id = await bookingsServiceMethods.create(booking)
      await loadBookings()
      showToast('Booking created successfully!', 'success')
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadBookings, showToast])

  const updateBooking = useCallback(async (id: string, booking: Partial<BookingDetail>) => {
    try {
      await bookingsServiceMethods.update(id, booking)
      await loadBookings()
      showToast('Booking updated successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadBookings, showToast])

  const deleteBooking = useCallback(async (id: string) => {
    try {
      await bookingsServiceMethods.delete(id)
      await loadBookings()
      showToast('Booking deleted successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadBookings, showToast])

  const updateBookingStatus = useCallback(async (id: string, status: BookingDetail['status']) => {
    try {
      await bookingsServiceMethods.updateStatus(id, status)
      await loadBookings()
      showToast('Booking status updated!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadBookings, showToast])

  const getBookingsByDate = useCallback(async (date: string): Promise<BookingDetail[]> => {
    try {
      return await bookingsServiceMethods.getByDate(date)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings'
      showToast(errorMessage, 'error')
      return []
    }
  }, [showToast])

  const getBookingsByDentist = useCallback(async (dentist: string, date?: string): Promise<BookingDetail[]> => {
    try {
      return await bookingsServiceMethods.getByDentist(dentist, date)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings'
      showToast(errorMessage, 'error')
      return []
    }
  }, [showToast])

  return {
    bookings,
    loading,
    error,
    loadBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    updateBookingStatus,
    getBookingsByDate,
    getBookingsByDentist,
  }
}

