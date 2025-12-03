import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Download, Home, UserCircle } from 'lucide-react'
import { BookingData } from '../types'
import { formatDate } from '../utils/dateUtils'
import { useBookings } from '../hooks/useBookings'
import { usePatients } from '../hooks/usePatients'
import { patientsServiceMethods } from '../services/patientsService'
import { format } from 'date-fns'
import { checkBookingConflict, isPastBooking } from '../utils/conflictDetection'

// Extended booking data that includes practiceId (branch)
interface ExtendedBookingData extends BookingData {
  branch: string | null // This maps to practiceId in Firestore
  paymentMethod: 'ozow' | 'instant-eft' | null
  popiaAccepted: boolean
}

const BookingConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state as ExtendedBookingData | null
  const [confettiFired, setConfettiFired] = useState(false)
  const { createBooking, bookings } = useBookings()
  const { searchPatients } = usePatients()
  const hasSavedRef = useRef(false) // Use ref to prevent duplicate saves even in StrictMode
  const savedBookingIdRef = useRef<string | null>(null) // Track which booking we've saved

  // Create a unique identifier for this booking attempt
  const bookingId = bookingData 
    ? `${bookingData.patientDetails.email}-${bookingData.date ? format(bookingData.date, 'yyyy-MM-dd') : ''}-${bookingData.time}`
    : null

  // Save booking to Firebase - separate effect to prevent duplicates
  useEffect(() => {
    if (!bookingData || !bookingId || hasSavedRef.current || savedBookingIdRef.current === bookingId) {
      return
    }

    const saveBooking = async () => {
      // Double-check with ref before proceeding (critical for StrictMode)
      if (hasSavedRef.current || savedBookingIdRef.current === bookingId) {
        return
      }
      
      // Set both guards immediately to prevent race conditions
      hasSavedRef.current = true
      savedBookingIdRef.current = bookingId

      try {
        // First, check if patient exists or create new patient
        const [firstName, ...lastNameParts] = bookingData.patientDetails.firstName.split(' ')
        const lastName = lastNameParts.join(' ') || bookingData.patientDetails.lastName
        
        // Try to search for existing patient, but don't fail if we can't (public users can't read patients)
        let existingPatient = null
        try {
          const existingPatients = await searchPatients(bookingData.patientDetails.email)
          existingPatient = existingPatients.find(p => p.email === bookingData.patientDetails.email)
        } catch (searchError) {
          // If search fails (due to permissions), assume patient doesn't exist and create new one
          console.log('Could not search for existing patient (permissions), will create new patient')
        }
        
        if (!existingPatient) {
          // Create new patient silently (don't show toast to patients)
          // Don't reload patients list after creation (public users can't read patients)
          try {
            await patientsServiceMethods.create({
              firstName: firstName,
              lastName: lastName,
              email: bookingData.patientDetails.email,
              phone: bookingData.patientDetails.phone,
              idNumber: bookingData.patientDetails.idNumber,
            })
          } catch (createError) {
            // If patient creation fails, log but continue with booking
            console.error('Could not create patient record:', createError)
            // Continue with booking creation anyway
          }
        }

        // Map branch to practiceId
        // 'weltevreden' -> 'weltevreden', 'ruimsig' -> 'ruimsig'
        const practiceId = bookingData.branch === 'weltevreden' ? 'weltevreden' : 
                           bookingData.branch === 'ruimsig' ? 'ruimsig' : 
                           'weltevreden' // Default fallback

        const dateStr = bookingData.date ? format(bookingData.date, 'yyyy-MM-dd') : ''
        const dentistName = bookingData.dentist?.name || ''
        const serviceDuration = bookingData.service?.duration || 15

        // Validate date is not in the past
        if (isPastBooking(dateStr, bookingData.time)) {
          console.error('Cannot create booking in the past')
          hasSavedRef.current = false
          savedBookingIdRef.current = null
          navigate('/booking', { replace: true })
          return
        }

        // Check for conflicts before creating (final validation)
        // Filter bookings by practice and check for conflicts
        const relevantBookings = bookings
          .filter((b) => 
            b.practiceId === practiceId &&
            b.date === dateStr && 
            b.dentist === dentistName && 
            b.status !== 'cancelled' &&
            b.status !== 'no-show'
          )
          .map((b) => ({
            id: b.id,
            dentist: b.dentist,
            date: b.date,
            time: b.time,
            duration: b.duration || 15,
          }))

        const bookingToCheck = {
          id: '',
          dentist: dentistName,
          date: dateStr,
          time: bookingData.time,
          duration: serviceDuration,
        }

        const conflictCheck = checkBookingConflict(bookingToCheck, relevantBookings)
        if (conflictCheck.hasConflict) {
          console.error('Booking conflict detected:', conflictCheck.message)
          hasSavedRef.current = false
          savedBookingIdRef.current = null
          // Redirect back to booking page - the slot is no longer available
          navigate('/booking', { 
            replace: true,
            state: { 
              error: 'The selected time slot is no longer available. Please select another time.',
              bookingData 
            }
          })
          return
        }

        // Create booking
        await createBooking({
          practiceId: practiceId, // REQUIRED: Maps from branch selection
          patient: `${firstName} ${lastName}`,
          email: bookingData.patientDetails.email,
          phone: bookingData.patientDetails.phone,
          service: bookingData.service?.name || '',
          dentist: dentistName,
          date: dateStr,
          time: bookingData.time,
          status: 'confirmed',
          source: 'online',
          deposit: 50, // R50 deposit as per requirements
          total: bookingData.service?.price || 0,
          duration: serviceDuration, // Include duration for conflict detection
        })
        
      } catch (error) {
        console.error('Failed to save booking:', error)
        // Reset refs on error so user can retry if needed
        hasSavedRef.current = false
        savedBookingIdRef.current = null
      }
    }

    saveBooking()
    // Only depend on bookingData and bookingId - functions are stable from hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData, bookingId])

  // Confetti effect - separate to prevent re-running booking save
  useEffect(() => {
    if (!bookingData || confettiFired) return

    // Confetti explosion
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    setConfettiFired(true)

    return () => clearInterval(interval)
  }, [bookingData, confettiFired])

  // Navigate if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate('/booking')
    }
  }, [bookingData, navigate])

  if (!bookingData) return null

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-4 sm:p-6 md:p-8 lg:p-12 text-center"
        >
          {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
            >
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-800 mb-3 md:mb-4"
            >
              Booking Confirmed!
            </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 px-2"
          >
            Your appointment has been successfully booked. We've sent a confirmation email to{' '}
            <span className="font-semibold text-gray-800">{bookingData.patientDetails.email}</span>
          </motion.p>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br bg-gray-50 border border-gray-200 rounded-card p-4 md:p-6 mb-6 md:mb-8 text-left"
          >
            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-4 md:mb-6">
              Appointment Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-700" />
                </div>
                  <div>
                    <div className="text-sm text-gray-600">Service</div>
                    <div className="font-semibold text-gray-800">
                      {bookingData.service?.name}
                    </div>
                  </div>
                </div>

                {bookingData.dentist && (
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Dentist</div>
                      <div className="font-semibold text-gray-800">
                        {bookingData.dentist.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {bookingData.dentist.specialization}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-semibold text-gray-800">
                      {bookingData.date ? formatDate(bookingData.date) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-semibold text-gray-800">{bookingData.time}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Patient</div>
                    <div className="font-semibold text-gray-800">
                      {bookingData.patientDetails.firstName}{' '}
                      {bookingData.patientDetails.lastName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-semibold text-gray-800">
                      {bookingData.patientDetails.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-semibold text-gray-800">
                      {bookingData.patientDetails.phone}
                    </div>
                  </div>
                </div>
            </div>

          </motion.div>

          {/* Reminders */}
          {(bookingData.reminders.sms ||
            bookingData.reminders.whatsapp ||
            bookingData.reminders.calendar) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 border-2 border-gray-200 rounded-card p-4 mb-8"
            >
              <p className="text-sm text-gray-700">
                ✓ You'll receive reminders via{' '}
                {[
                  bookingData.reminders.sms && 'SMS',
                  bookingData.reminders.whatsapp && 'WhatsApp',
                  bookingData.reminders.calendar && 'Google Calendar',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4"
          >
            <button className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span>Download Confirmation</span>
            </button>
            <Link to="/" className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Cancellation Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-gray-500"
          >
            Need to cancel? Check your email for a cancellation link or{' '}
            <Link to="/contact" className="text-gray-700 hover:underline">
              contact us
            </Link>
            .
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingConfirmation

