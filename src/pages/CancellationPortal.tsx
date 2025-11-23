import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, Calendar, Clock, AlertTriangle, Home } from 'lucide-react'
import { formatDate } from '../utils/dateUtils'

const CancellationPortal = () => {
  const { token: _token } = useParams()
  const [cancelled, setCancelled] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock appointment data
  const appointment = {
    id: 'APT-12345',
    service: 'Comprehensive Consultation',
    date: new Date('2024-02-15'),
    time: '10:00',
    patient: 'John Doe',
    deposit: 50,
  }

  const handleCancel = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setCancelled(true)
    setLoading(false)
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>

            <h1 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Appointment Cancelled
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your appointment has been successfully cancelled. We're sorry to see you go!
            </p>

            <div className="bg-gray-50 rounded-card p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-800 mb-4">Cancellation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-semibold">{appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit Refund:</span>
                  <span className="font-semibold text-gray-700">
                    R{appointment.deposit} (Processing)
                  </span>
                </div>
              </div>
            </div>

            <Link to="/" className="btn-primary inline-flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Return to Home</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
              Cancel Appointment
            </h1>
            <p className="text-gray-600">
              Are you sure you want to cancel this appointment?
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-card p-6 mb-8 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Appointment Details</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Service</div>
                  <div className="font-semibold text-gray-800">{appointment.service}</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-semibold text-gray-800">
                    {formatDate(appointment.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Time</div>
                  <div className="font-semibold text-gray-800">{appointment.time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-card p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">Important Information:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your R{appointment.deposit} deposit will be refunded within 5-7 business days</li>
                  <li>You can reschedule instead of cancelling</li>
                  <li>Late cancellations (less than 24 hours) may incur a fee</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-secondary w-full sm:w-auto text-center">
              Keep Appointment
            </Link>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-button transition-all duration-300 w-full sm:w-auto disabled:opacity-50"
            >
              {loading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CancellationPortal

