import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, CreditCard, TrendingDown, Clock, User, Plus } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import 'react-day-picker/dist/style.css'

const StaffDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Mock data
  const metrics = {
    todayAppointments: 12,
    revenue: 15450,
    depositsCollected: 600,
    noShowsSaved: 5,
  }

  const initialAppointments = [
    {
      id: '1',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning',
      time: '09:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
    },
    {
      id: '2',
      patient: 'James Thompson',
      service: 'Consultation',
      time: '10:30',
      dentist: 'Dr. Michael Chen',
      status: 'confirmed',
    },
    {
      id: '3',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      time: '14:00',
      dentist: 'Dr. Emily Williams',
      status: 'pending',
    },
    {
      id: '4',
      patient: 'Michael Brown',
      service: 'Root Canal',
      time: '15:30',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
    },
    {
      id: '5',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      time: '16:00',
      dentist: 'Dr. Michael Chen',
      status: 'confirmed',
    },
  ]

  const [bookings, setBookings] = useState(initialAppointments)

  const handleCreateBooking = (newBooking: any) => {
    const appointment = {
      id: newBooking.id,
      patient: newBooking.patient,
      service: newBooking.service,
      time: newBooking.time,
      dentist: newBooking.dentist,
      status: newBooking.status as 'confirmed' | 'pending',
    }
    setBookings((prev) => [appointment, ...prev].slice(0, 5))
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Overview of today's operations</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Booking</span>
          </button>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Today's Appointments",
              value: metrics.todayAppointments,
              icon: Calendar,
              color: 'gray',
            },
            {
              label: 'Revenue',
              value: `R${metrics.revenue.toLocaleString()}`,
              icon: DollarSign,
              color: 'green',
            },
            {
              label: 'Deposits Collected',
              value: `R${metrics.depositsCollected}`,
              icon: CreditCard,
              color: 'blue',
            },
            {
              label: 'No-Shows Saved',
              value: metrics.noShowsSaved,
              icon: TrendingDown,
              color: 'orange',
            },
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                Next 5 Appointments
              </h2>
              <div className="space-y-4">
                {bookings.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{apt.patient}</h3>
                        <p className="text-sm text-gray-600">{apt.service}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{apt.time}</span>
                          </span>
                          <span>{apt.dentist}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mini Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
              Calendar
            </h2>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiersClassNames={{
                selected: 'bg-gray-800 text-white rounded-full',
              }}
              className="mx-auto"
            />
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-semibold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateBooking}
      />
    </div>
  )
}

export default StaffDashboard

