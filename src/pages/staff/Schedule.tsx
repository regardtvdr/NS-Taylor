import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Phone, MessageCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isSameDay, addDays, subDays, parseISO } from 'date-fns'

interface ScheduleAppointment {
  id: string
  time: string
  patient: string
  service: string
  dentist: string
  depositPaid: boolean
  status: 'scheduled' | 'arrived' | 'no-show' | 'completed'
  phone?: string
  email?: string
  date: string
}

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Mock appointments data - in a real app, this would come from an API
  const allAppointments: ScheduleAppointment[] = [
    {
      id: '1',
      time: '08:00',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 82 123 4567',
      email: 'sarah.mitchell@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '2',
      time: '09:30',
      patient: 'James Thompson',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Michael Chen',
      depositPaid: true,
      status: 'arrived',
      phone: '+27 83 234 5678',
      email: 'james.thompson@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '3',
      time: '10:00',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 84 345 6789',
      email: 'emma.wilson@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '4',
      time: '11:00',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: false,
      status: 'scheduled',
      phone: '+27 85 456 7890',
      email: 'michael.brown@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '5',
      time: '13:30',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 86 567 8901',
      email: 'lisa.anderson@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '6',
      time: '14:00',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'no-show',
      phone: '+27 87 678 9012',
      email: 'david.lee@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '7',
      time: '15:30',
      patient: 'Jennifer Martinez',
      service: 'Regular Checkup',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 88 789 0123',
      email: 'jennifer.martinez@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '8',
      time: '16:00',
      patient: 'Robert Taylor',
      service: 'Teeth Cleaning',
      dentist: 'Dr. Michael Chen',
      depositPaid: false,
      status: 'scheduled',
      phone: '+27 89 890 1234',
      email: 'robert.taylor@email.com',
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  ]

  // Filter appointments for selected date
  const dayAppointments = useMemo(() => {
    return allAppointments.filter((apt) => {
      try {
        return isSameDay(parseISO(apt.date), selectedDate)
      } catch {
        return false
      }
    })
  }, [selectedDate, allAppointments])

  // Group appointments by hour
  const appointmentsByHour = useMemo(() => {
    const grouped: Record<string, ScheduleAppointment[]> = {}
    
    // Initialize all hours from 8:00 to 17:00
    for (let hour = 8; hour < 18; hour++) {
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      grouped[timeKey] = []
    }

    dayAppointments.forEach((apt) => {
      const hour = parseInt(apt.time.split(':')[0])
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      if (!grouped[timeKey]) {
        grouped[timeKey] = []
      }
      grouped[timeKey].push(apt)
    })

    return grouped
  }, [dayAppointments])

  const handleAction = (id: string, action: 'call' | 'whatsapp' | 'arrived' | 'no-show') => {
    // In a real app, this would update the appointment status
    console.log(`${action} for appointment ${id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'no-show':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => (direction === 'next' ? addDays(prev, 1) : subDays(prev, 1)))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
                Daily Schedule
              </h1>
              <p className="text-gray-600">View appointments organized by hour</p>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-display font-semibold text-gray-800">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h2>
                {!isSameDay(selectedDate, new Date()) && (
                  <button
                    onClick={goToToday}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Today
                  </button>
                )}
              </div>
              <button
                onClick={() => navigateDate('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hourly Schedule */}
        <div className="space-y-4">
          {Object.entries(appointmentsByHour).map(([hour, appointments], hourIndex) => (
            <motion.div
              key={hour}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: hourIndex * 0.03 }}
              className="card p-6"
            >
              <div className="flex items-start space-x-6">
                {/* Hour Label */}
                <div className="flex flex-col items-center min-w-[100px] pt-1">
                  <Clock className="w-5 h-5 text-gray-600 mb-2" />
                  <span className="text-lg font-bold text-gray-800">{hour}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                  </span>
                </div>

                {/* Appointments for this hour */}
                <div className="flex-1 space-y-3">
                  {appointments.length === 0 ? (
                    <div className="py-4 text-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      No appointments scheduled
                    </div>
                  ) : (
                    appointments.map((apt, index) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: hourIndex * 0.03 + index * 0.05 }}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{apt.patient}</h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}
                                >
                                  {apt.status === 'arrived'
                                    ? 'Arrived'
                                    : apt.status === 'no-show'
                                    ? 'No-Show'
                                    : apt.status === 'completed'
                                    ? 'Completed'
                                    : 'Scheduled'}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-1">{apt.service}</p>
                              <p className="text-sm text-gray-500 mb-2">{apt.dentist}</p>
                              <div className="flex items-center space-x-4 text-xs">
                                <span
                                  className={`${
                                    apt.depositPaid ? 'text-green-600' : 'text-orange-600'
                                  }`}
                                >
                                  {apt.depositPaid ? '✓ Deposit Paid' : '⚠ Deposit Pending'}
                                </span>
                                {apt.phone && (
                                  <span className="text-gray-500 flex items-center space-x-1">
                                    <Phone className="w-3 h-3" />
                                    <span>{apt.phone}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {apt.phone && (
                              <>
                                <button
                                  onClick={() => handleAction(apt.id, 'call')}
                                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  title="Call"
                                >
                                  <Phone className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                  onClick={() => handleAction(apt.id, 'whatsapp')}
                                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4 text-gray-700" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleAction(apt.id, 'arrived')}
                              className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                              title="Mark as Arrived"
                            >
                              <CheckCircle className="w-4 h-4 text-green-700" />
                            </button>
                            <button
                              onClick={() => handleAction(apt.id, 'no-show')}
                              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                              title="Mark as No-Show"
                            >
                              <XCircle className="w-4 h-4 text-red-700" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        {dayAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Day Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{dayAppointments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrived</p>
                <p className="text-2xl font-bold text-green-600">
                  {dayAppointments.filter((a) => a.status === 'arrived').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-600">
                  {dayAppointments.filter((a) => a.status === 'scheduled').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No-Shows</p>
                <p className="text-2xl font-bold text-red-600">
                  {dayAppointments.filter((a) => a.status === 'no-show').length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Schedule

