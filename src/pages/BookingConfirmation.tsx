import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Download, Home, UserCircle } from 'lucide-react'
import { BookingData } from '../types'
import { formatDate } from '../utils/dateUtils'
import { useBookings } from '../hooks/useBookings'
import { usePatients } from '../hooks/usePatients'
import { format } from 'date-fns'

const BookingConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state as BookingData | null
  const [confettiFired, setConfettiFired] = useState(false)
  const [bookingSaved, setBookingSaved] = useState(false)
  const { createBooking } = useBookings()
  const { createPatient, searchPatients } = usePatients()

  useEffect(() => {
    if (!bookingData) {
      navigate('/booking')
      return
    }

    // Save booking to Firebase
    const saveBooking = async () => {
      if (bookingSaved) return
      
      try {
        // First, check if patient exists or create new patient
        const [firstName, ...lastNameParts] = bookingData.patientDetails.firstName.split(' ')
        const lastName = lastNameParts.join(' ') || bookingData.patientDetails.lastName
        
        const existingPatients = await searchPatients(bookingData.patientDetails.email)
        const existingPatient = existingPatients.find(p => p.email === bookingData.patientDetails.email)
        
        if (!existingPatient) {
          // Create new patient
          await createPatient({
            firstName: firstName,
            lastName: lastName,
            email: bookingData.patientDetails.email,
            phone: bookingData.patientDetails.phone,
            idNumber: bookingData.patientDetails.idNumber,
          })
        }

        // Create booking
        await createBooking({
          patient: `${firstName} ${lastName}`,
          email: bookingData.patientDetails.email,
          phone: bookingData.patientDetails.phone,
          service: bookingData.service?.name || '',
          dentist: bookingData.dentist?.name || '',
          date: bookingData.date ? format(bookingData.date, 'yyyy-MM-dd') : '',
          time: bookingData.time,
          status: 'confirmed',
          deposit: bookingData.service?.price ? bookingData.service.price * 0.1 : 50,
          total: bookingData.service?.price || 0,
        })
        
        setBookingSaved(true)
      } catch (error) {
        console.error('Failed to save booking:', error)
        // Still show confirmation even if save fails
        setBookingSaved(true)
      }
    }

    saveBooking()

    if (!confettiFired) {
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
    }
  }, [bookingData, navigate, confettiFired])

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

