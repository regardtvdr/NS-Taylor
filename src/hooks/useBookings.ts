import { useState, useEffect, useCallback } from 'react'
import { bookingsServiceMethods } from '../services/bookingsService'
import { BookingDetail } from '../types'
import { useToast } from '../contexts/ToastContext'
import { useUserPractices } from './useUserPractices'

export const useBookings = (options?: { filterByUserPractices?: boolean }) => {
  const [bookings, setBookings] = useState<BookingDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()
  const { practices, isAdmin, loading: userLoading } = useUserPractices()

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // If filtering by user practices and user is not admin, filter bookings
      if (options?.filterByUserPractices && !isAdmin && practices.length > 0) {
        const data = await bookingsServiceMethods.getByPractices(practices)
        setBookings(data)
      } else if (options?.filterByUserPractices && isAdmin) {
        // Admins see all bookings
        const data = await bookingsServiceMethods.getAll()
        setBookings(data)
      } else {
        // Default: load all bookings (for patient-facing pages)
        const data = await bookingsServiceMethods.getAll()
        setBookings(data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast, options?.filterByUserPractices, isAdmin, practices])

  useEffect(() => {
    // Wait for user data to load before fetching bookings if filtering by practices
    if (options?.filterByUserPractices && userLoading) {
      return
    }
    loadBookings()
  }, [loadBookings, options?.filterByUserPractices, userLoading])

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

