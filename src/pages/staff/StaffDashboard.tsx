import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, CreditCard, TrendingDown, Clock, User, Plus } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format, isSameDay, parseISO } from 'date-fns'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import 'react-day-picker/dist/style.css'

interface Booking {
  id: string
  patient: string
  service: string
  time: string
  dentist: string
  status: 'confirmed' | 'pending'
  date?: string
}

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

  // Extended bookings with dates for calendar visualization
  const [allBookings, setAllBookings] = useState<Booking[]>([
    {
      id: '1',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning',
      time: '09:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '2',
      patient: 'James Thompson',
      service: 'Consultation',
      time: '10:30',
      dentist: 'Dr. Michael Chen',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '3',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      time: '14:00',
      dentist: 'Dr. Emily Williams',
      status: 'pending',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '4',
      patient: 'Michael Brown',
      service: 'Root Canal',
      time: '15:30',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '5',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      time: '16:00',
      dentist: 'Dr. Michael Chen',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    // Add more bookings for different dates
    {
      id: '6',
      patient: 'John Doe',
      service: 'Checkup',
      time: '10:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    },
    {
      id: '7',
      patient: 'Jane Smith',
      service: 'Cleaning',
      time: '14:30',
      dentist: 'Dr. Emily Williams',
      status: 'confirmed',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    },
    {
      id: '8',
      patient: 'Bob Wilson',
      service: 'Extraction',
      time: '11:00',
      dentist: 'Dr. Michael Chen',
      status: 'pending',
      date: format(new Date(Date.now() + 2 * 86400000), 'yyyy-MM-dd'), // Day after tomorrow
    },
  ])

  const [bookings, setBookings] = useState<Booking[]>([])
  
  // Update today's bookings when allBookings changes
  useEffect(() => {
    const todayBookings = allBookings.filter(b => {
      if (!b.date) return false
      try {
        return isSameDay(parseISO(b.date), new Date())
      } catch {
        return false
      }
    })
    setBookings(todayBookings.slice(0, 5))
  }, [allBookings])

  // Get dates that have bookings
  const datesWithBookings = useMemo(() => {
    const dates = new Set<string>()
    allBookings.forEach((booking) => {
      if (booking.date) {
        dates.add(booking.date)
      }
    })
    return dates
  }, [allBookings])

  // Get booking count for a specific date
  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return allBookings.filter((b) => b.date === dateStr).length
  }

  // Check if date has bookings
  const hasBookings = (date: Date): boolean => {
    return datesWithBookings.has(format(date, 'yyyy-MM-dd'))
  }

  const handleCreateBooking = (newBooking: any) => {
    const appointment: Booking = {
      id: newBooking.id,
      patient: newBooking.patient,
      service: newBooking.service,
      time: newBooking.time,
      dentist: newBooking.dentist,
      status: newBooking.status as 'confirmed' | 'pending',
      date: newBooking.date || format(new Date(), 'yyyy-MM-dd'),
    }
    setAllBookings((prev) => [...prev, appointment])
    if (isSameDay(parseISO(appointment.date || format(new Date(), 'yyyy-MM-dd')), new Date())) {
      setBookings((prev) => [appointment, ...prev].slice(0, 5))
    }
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

          {/* Enhanced Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
              Calendar
            </h2>
            <div className="relative">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                modifiers={{
                  hasBookings: (date) => hasBookings(date),
                  manyBookings: (date) => getBookingCountForDate(date) >= 5,
                  mediumBookings: (date) => {
                    const count = getBookingCountForDate(date)
                    return count >= 3 && count < 5
                  },
                  fewBookings: (date) => {
                    const count = getBookingCountForDate(date)
                    return count > 0 && count < 3
                  },
                }}
                modifiersClassNames={{
                  selected: 'bg-gray-800 text-white rounded-full font-semibold',
                  manyBookings: 'bg-red-50 hover:bg-red-100 border-red-200',
                  mediumBookings: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
                  fewBookings: 'bg-green-50 hover:bg-green-100 border-green-200',
                }}
                className="mx-auto"
              />
              <style>{`
                .rdp-day.hasBookings:not(.selected)::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background-color: currentColor;
                }
                .rdp-day.manyBookings:not(.selected)::after {
                  background-color: #ef4444;
                }
                .rdp-day.mediumBookings:not(.selected)::after {
                  background-color: #f97316;
                }
                .rdp-day.fewBookings:not(.selected)::after {
                  background-color: #22c55e;
                }
              `}</style>
            </div>
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: <span className="font-semibold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</span>
                </p>
                {hasBookings(selectedDate) && (
                  <p className="text-sm font-medium text-gray-800">
                    {getBookingCountForDate(selectedDate)} {getBookingCountForDate(selectedDate) === 1 ? 'appointment' : 'appointments'} scheduled
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">1-2 bookings</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">3-4 bookings</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">5+ bookings</span>
                </div>
              </div>
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

