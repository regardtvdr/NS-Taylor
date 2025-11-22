import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Clock, DollarSign, MapPin, FileText, CreditCard } from 'lucide-react'
import { format } from 'date-fns'

interface BookingDetail {
  id: string
  patient: string
  email: string
  phone: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  deposit: number
  total: number
  notes?: string
  createdAt?: string
}

interface BookingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingDetail | null
}

const BookingDetailModal = ({ isOpen, onClose, booking }: BookingDetailModalProps) => {
  if (!isOpen || !booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-800">Booking Details</h2>
              <p className="text-sm text-gray-500 mt-1">ID: {booking.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              {booking.createdAt && (
                <p className="text-sm text-gray-500">
                  Created: {format(new Date(booking.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              )}
            </div>

            {/* Patient Information */}
            <div className="card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Patient Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800">{booking.patient}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{booking.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{booking.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Appointment Details</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-gray-800">{booking.service}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Dentist</p>
                    <p className="font-semibold text-gray-800">{booking.dentist}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">
                      {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">{booking.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Service Total</span>
                  <span className="text-lg font-bold text-gray-800">R{booking.total}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Deposit</span>
                  <span className={`text-lg font-semibold ${booking.deposit > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {booking.deposit > 0 ? `R${booking.deposit} ✓ Paid` : 'Not Paid'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-t border-gray-200">
                  <span className="text-gray-600 font-semibold">Balance Due</span>
                  <span className="text-lg font-bold text-gray-800">R{booking.total - booking.deposit}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="card p-6">
                <h3 className="text-lg font-display font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Notes</span>
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingDetailModal

