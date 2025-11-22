import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle, Calendar, Clock, User, Mail, Phone, Download, Home, UserCircle } from 'lucide-react'
import { BookingData } from '../types'
import { formatDate } from '../utils/dateUtils'
import { DEPOSIT_AMOUNT } from '../utils/constants'

const BookingConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state as BookingData | null
  const [confettiFired, setConfettiFired] = useState(false)

  useEffect(() => {
    if (!bookingData) {
      navigate('/booking')
      return
    }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4"
            >
              Booking Confirmed!
            </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Your appointment has been successfully booked. We've sent a confirmation email to{' '}
            <span className="font-semibold text-gray-800">{bookingData.patientDetails.email}</span>
          </motion.p>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br bg-gray-50 border border-gray-200 rounded-card p-6 mb-8 text-left"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Deposit Paid</span>
                <span className="text-2xl font-bold text-gray-800">R{DEPOSIT_AMOUNT}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-600">Balance Due</span>
                <span className="text-lg font-semibold text-gray-800">
                  R{(bookingData.service?.price || 0) - DEPOSIT_AMOUNT}
                </span>
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download Confirmation</span>
            </button>
            <Link to="/" className="btn-primary flex items-center space-x-2">
              <Home className="w-5 h-5" />
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

