/**
 * Example: How to integrate Firebase into your components
 * 
 * This file shows examples of how to use Firebase services in your React components.
 * You can use these patterns to replace mock data with real Firebase data.
 */

import { useEffect, useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import { usePatients } from '../hooks/usePatients'
import { BookingDetail, Patient } from '../types'

// Example 1: Using the useBookings hook
export const BookingsListExample = () => {
  const { bookings, loading, error, createBooking, deleteBooking } = useBookings()

  if (loading) return <div>Loading bookings...</div>
  if (error) return <div>Error: {error}</div>

  const handleCreateBooking = async () => {
    const newBooking: Partial<BookingDetail> = {
      patient: 'John Doe',
      email: 'john@example.com',
      phone: '+27 82 123 4567',
      service: 'Teeth Cleaning',
      dentist: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmed',
      total: 650,
    }
    
    try {
      await createBooking(newBooking)
      console.log('Booking created!')
    } catch (error) {
      console.error('Failed to create booking:', error)
    }
  }

  return (
    <div>
      <button onClick={handleCreateBooking}>Create Booking</button>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.patient} - {booking.service} - {booking.date} at {booking.time}
            <button onClick={() => deleteBooking(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Example 2: Using the usePatients hook
export const PatientsListExample = () => {
  const { loading, searchPatients, createPatient } = usePatients()
  const [searchResults, setSearchResults] = useState<Patient[]>([])

  const handleSearch = async (searchTerm: string) => {
    const results = await searchPatients(searchTerm)
    setSearchResults(results)
  }

  const handleCreatePatient = async () => {
    const newPatient = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+27 83 234 5678',
    }
    
    try {
      await createPatient(newPatient)
      console.log('Patient created!')
    } catch (error) {
      console.error('Failed to create patient:', error)
    }
  }

  if (loading) return <div>Loading patients...</div>

  return (
    <div>
      <input
        type="text"
        placeholder="Search patients..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button onClick={handleCreatePatient}>Create Patient</button>
      <ul>
        {searchResults.map((patient) => (
          <li key={patient.id}>
            {patient.firstName} {patient.lastName} - {patient.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Example 3: Direct service usage (without hooks)
import { bookingsServiceMethods } from '../services/bookingsService'

export const DirectServiceExample = () => {
  const [bookings, setBookings] = useState<BookingDetail[]>([])

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Get bookings for today
        const today = new Date().toISOString().split('T')[0]
        const todayBookings = await bookingsServiceMethods.getByDate(today)
        setBookings(todayBookings)
      } catch (error) {
        console.error('Failed to load bookings:', error)
      }
    }
    
    loadBookings()
  }, [])

  return (
    <div>
      <h2>Today's Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.patient} - {booking.time}
          </li>
        ))}
      </ul>
    </div>
  )
}

