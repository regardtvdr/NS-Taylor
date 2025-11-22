import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle, XCircle, Clock, User } from 'lucide-react'

interface TodayAppointment {
  id: string
  time: string
  patient: string
  patientPhoto?: string
  service: string
  dentist: string
  depositPaid: boolean
  status: 'scheduled' | 'arrived' | 'no-show'
}

const Today = () => {
  const [appointments, setAppointments] = useState<TodayAppointment[]>([
    {
      id: '1',
      time: '08:00',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: true,
      status: 'scheduled',
    },
    {
      id: '2',
      time: '09:30',
      patient: 'James Thompson',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Michael Chen',
      depositPaid: true,
      status: 'arrived',
    },
    {
      id: '3',
      time: '11:00',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'scheduled',
    },
    {
      id: '4',
      time: '13:30',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: false,
      status: 'scheduled',
    },
    {
      id: '5',
      time: '15:00',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      depositPaid: true,
      status: 'scheduled',
    },
    {
      id: '6',
      time: '16:30',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'no-show',
    },
  ])

  const handleAction = (id: string, action: 'call' | 'whatsapp' | 'arrived' | 'no-show') => {
    if (action === 'arrived' || action === 'no-show') {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: action === 'arrived' ? 'arrived' : 'no-show' } : apt
        )
      )
    } else {
      // Simulate call/WhatsApp action
      console.log(`${action} for appointment ${id}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'no-show':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
            Today's Schedule
          </h1>
          <p className="text-gray-600">Manage today's appointments</p>
        </motion.div>

        <div className="space-y-4">
          {appointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <Clock className="w-5 h-5 text-gray-600 mb-2" />
                    <span className="text-lg font-bold text-gray-800">{apt.time}</span>
                  </div>

                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {apt.patientPhoto ? (
                        <img src={apt.patientPhoto} alt={apt.patient} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{apt.patient}</h3>
                      <p className="text-gray-600 mb-2">{apt.service}</p>
                      <p className="text-sm text-gray-500">{apt.dentist}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}
                        >
                          {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                        </span>
                        <span
                          className={`text-xs ${
                            apt.depositPaid ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {apt.depositPaid ? '✓ Deposit Paid' : '⚠ Deposit Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleAction(apt.id, 'call')}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Call"
                  >
                    <Phone className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleAction(apt.id, 'whatsapp')}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleAction(apt.id, 'arrived')}
                    className="p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    title="Mark as Arrived"
                  >
                    <CheckCircle className="w-5 h-5 text-green-700" />
                  </button>
                  <button
                    onClick={() => handleAction(apt.id, 'no-show')}
                    className="p-3 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    title="Mark as No-Show"
                  >
                    <XCircle className="w-5 h-5 text-red-700" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Today

