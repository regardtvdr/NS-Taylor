import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, User, Phone, MessageCircle, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react'
import { format, parseISO, addDays, subDays, isSameDay } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { DENTISTS } from '../../utils/constants'
import { generateTimeSlots } from '../../utils/dateUtils'
import { useToast } from '../../contexts/ToastContext'
import { playSound } from '../../utils/sounds'
import 'react-day-picker/dist/style.css'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleAppointment | null>(null)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null)
  const [rescheduleTime, setRescheduleTime] = useState<string>('')
  const { showToast } = useToast()

  // Mock appointments data - in a real app, this would come from an API
  const [allAppointments, setAllAppointments] = useState<ScheduleAppointment[]>([
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
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
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
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    },
  ])

  // Filter appointments based on search and date
  const filteredAppointments = useMemo(() => {
    let filtered = allAppointments

    // Filter by search term (patient name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((apt) =>
        apt.patient.toLowerCase().includes(searchLower) ||
        apt.service.toLowerCase().includes(searchLower) ||
        apt.dentist.toLowerCase().includes(searchLower) ||
        apt.phone?.toLowerCase().includes(searchLower) ||
        apt.email?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((apt) => {
        try {
          return isSameDay(parseISO(apt.date), dateFilter)
        } catch {
          return false
        }
      })
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
  }, [searchTerm, dateFilter, allAppointments])

  const handleReschedule = (appointment: ScheduleAppointment) => {
    setSelectedAppointment(appointment)
    setRescheduleDate(parseISO(appointment.date))
    setRescheduleTime(appointment.time)
    setIsRescheduleModalOpen(true)
  }

  const handleConfirmReschedule = () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return

    setAllAppointments((prev) =>
      prev.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, date: format(rescheduleDate, 'yyyy-MM-dd'), time: rescheduleTime }
          : apt
      )
    )

    playSound('success')
    showToast(`Appointment rescheduled to ${format(rescheduleDate, 'MMM d, yyyy')} at ${rescheduleTime}`, 'success')
    setIsRescheduleModalOpen(false)
    setSelectedAppointment(null)
    setRescheduleDate(null)
    setRescheduleTime('')
  }

  const handleDelete = (appointment: ScheduleAppointment) => {
    setSelectedAppointment(appointment)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedAppointment) return

    setAllAppointments((prev) => prev.filter((apt) => apt.id !== selectedAppointment.id))
    playSound('success')
    showToast('Appointment deleted successfully', 'success')
    setIsDeleteModalOpen(false)
    setSelectedAppointment(null)
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

  const timeSlots = rescheduleDate ? generateTimeSlots(rescheduleDate) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
              Manage Appointments
            </h1>
            <p className="text-gray-600">Search, reschedule, or delete appointments</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="card p-4 bg-white">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient name, service, dentist, phone, or email..."
                  className="input-field pl-12 w-full"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">
                    {dateFilter ? format(dateFilter, 'MMM d, yyyy') : 'All Dates'}
                  </span>
                  {dateFilter && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDateFilter(null)
                      }}
                      className="ml-2 p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </button>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 calendar-wrapper"
                  >
                    <DayPicker
                      mode="single"
                      selected={dateFilter || undefined}
                      onSelect={(date) => {
                        setDateFilter(date || null)
                        setIsCalendarOpen(false)
                      }}
                      disabled={(date) => {
                        const day = date.getDay()
                        return day === 0 || day === 6
                      }}
                      modifiersClassNames={{
                        selected: 'bg-gray-800 text-white rounded-full',
                      }}
                    />
                    <style>{`
                      .calendar-wrapper .rdp {
                        --rdp-cell-size: 40px;
                        --rdp-accent-color: #1f2937;
                        --rdp-background-color: #f9fafb;
                        --rdp-accent-color-dark: #374151;
                        --rdp-background-color-dark: #111827;
                        --rdp-outline: 2px solid var(--rdp-accent-color);
                        --rdp-outline-selected: 2px solid var(--rdp-accent-color);
                        font-size: 14px;
                      }
                      .calendar-wrapper .rdp-month {
                        margin: 0;
                      }
                      .calendar-wrapper .rdp-table {
                        width: 100%;
                      }
                      .calendar-wrapper .rdp-head_cell {
                        font-weight: 600;
                        font-size: 12px;
                        color: #374151;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        padding: 8px 0;
                      }
                      .calendar-wrapper .rdp-day {
                        width: var(--rdp-cell-size);
                        height: var(--rdp-cell-size);
                        font-weight: 500;
                        color: #1f2937;
                        border: 1px solid transparent;
                        border-radius: 8px;
                        transition: all 0.2s;
                      }
                      .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                        background-color: #f3f4f6;
                        border-color: #d1d5db;
                        color: #111827;
                      }
                      .calendar-wrapper .rdp-day_selected {
                        background-color: #1f2937 !important;
                        color: white !important;
                        font-weight: 600;
                      }
                      .calendar-wrapper .rdp-day_today {
                        font-weight: 700;
                        color: #1f2937;
                      }
                      .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
                        border: 2px solid #6b7280;
                      }
                      .calendar-wrapper .rdp-day_disabled {
                        color: #d1d5db;
                        opacity: 0.5;
                      }
                      .calendar-wrapper .rdp-caption {
                        font-weight: 600;
                        font-size: 16px;
                        color: #111827;
                        padding: 8px 0;
                        margin-bottom: 8px;
                      }
                      .calendar-wrapper .rdp-button {
                        color: #374151;
                      }
                      .calendar-wrapper .rdp-button:hover {
                        background-color: #f3f4f6;
                      }
                      .calendar-wrapper .rdp-nav_button {
                        width: 32px;
                        height: 32px;
                      }
                      .calendar-wrapper .rdp-nav_button:hover {
                        background-color: #f3f4f6;
                        border-radius: 6px;
                      }
                    `}</style>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {dateFilter && ` on ${format(dateFilter, 'MMMM d, yyyy')}`}
          </p>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 bg-white text-center"
            >
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or date filter</p>
            </motion.div>
          ) : (
            filteredAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Appointment Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{apt.patient}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
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
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{format(parseISO(apt.date), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{apt.time}</span>
                        </div>
                        {apt.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{apt.phone}</span>
                          </div>
                        )}
                        <span className={`text-sm ${apt.depositPaid ? 'text-green-600' : 'text-orange-600'}`}>
                          {apt.depositPaid ? '✓ Deposit Paid' : '⚠ Deposit Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {apt.phone && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showToast(`Calling ${apt.patient}...`, 'info')}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-gray-700" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReschedule(apt)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      title="Reschedule"
                    >
                      <Edit2 className="w-4 h-4 text-blue-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(apt)}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-700" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {isRescheduleModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-800">Reschedule Appointment</h2>
                <button
                  onClick={() => {
                    setIsRescheduleModalOpen(false)
                    setSelectedAppointment(null)
                    setRescheduleDate(null)
                    setRescheduleTime('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Patient</p>
                <p className="font-semibold text-gray-800">{selectedAppointment.patient}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedAppointment.service}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Select New Date *</label>
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className={rescheduleDate ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                        {rescheduleDate ? format(rescheduleDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                      </span>
                    </div>
                  </button>
                  {isCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-white rounded-lg shadow-lg p-4 border border-gray-200 calendar-wrapper"
                    >
                      <DayPicker
                        mode="single"
                        selected={rescheduleDate || undefined}
                        onSelect={(date) => {
                          if (date) {
                            setRescheduleDate(date)
                            setRescheduleTime('')
                            setIsCalendarOpen(false)
                          }
                        }}
                        disabled={(date) => {
                          const day = date.getDay()
                          return day === 0 || day === 6
                        }}
                        modifiersClassNames={{
                          selected: 'bg-gray-800 text-white rounded-full',
                        }}
                      />
                      <style>{`
                        .calendar-wrapper .rdp {
                          --rdp-cell-size: 40px;
                          --rdp-accent-color: #1f2937;
                          --rdp-background-color: #f9fafb;
                          --rdp-accent-color-dark: #374151;
                          --rdp-background-color-dark: #111827;
                          --rdp-outline: 2px solid var(--rdp-accent-color);
                          --rdp-outline-selected: 2px solid var(--rdp-accent-color);
                          font-size: 14px;
                        }
                        .calendar-wrapper .rdp-month {
                          margin: 0;
                        }
                        .calendar-wrapper .rdp-table {
                          width: 100%;
                        }
                        .calendar-wrapper .rdp-head_cell {
                          font-weight: 600;
                          font-size: 12px;
                          color: #374151;
                          text-transform: uppercase;
                          letter-spacing: 0.05em;
                          padding: 8px 0;
                        }
                        .calendar-wrapper .rdp-day {
                          width: var(--rdp-cell-size);
                          height: var(--rdp-cell-size);
                          font-weight: 500;
                          color: #1f2937;
                          border: 1px solid transparent;
                          border-radius: 8px;
                          transition: all 0.2s;
                        }
                        .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                          background-color: #f3f4f6;
                          border-color: #d1d5db;
                          color: #111827;
                        }
                        .calendar-wrapper .rdp-day_selected {
                          background-color: #1f2937 !important;
                          color: white !important;
                          font-weight: 600;
                        }
                        .calendar-wrapper .rdp-day_today {
                          font-weight: 700;
                          color: #1f2937;
                        }
                        .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
                          border: 2px solid #6b7280;
                        }
                        .calendar-wrapper .rdp-day_disabled {
                          color: #d1d5db;
                          opacity: 0.5;
                        }
                        .calendar-wrapper .rdp-caption {
                          font-weight: 600;
                          font-size: 16px;
                          color: #111827;
                          padding: 8px 0;
                          margin-bottom: 8px;
                        }
                        .calendar-wrapper .rdp-button {
                          color: #374151;
                        }
                        .calendar-wrapper .rdp-button:hover {
                          background-color: #f3f4f6;
                        }
                        .calendar-wrapper .rdp-nav_button {
                          width: 32px;
                          height: 32px;
                        }
                        .calendar-wrapper .rdp-nav_button:hover {
                          background-color: #f3f4f6;
                          border-radius: 6px;
                        }
                      `}</style>
                    </motion.div>
                  )}
                </div>

                {rescheduleDate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Select New Time *</label>
                    <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                      {timeSlots.map((time) => (
                        <motion.button
                          key={time}
                          onClick={() => setRescheduleTime(time)}
                          whileHover={rescheduleTime !== time ? { scale: 1.05, y: -2 } : {}}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-lg border-2 text-center transition-all font-semibold ${
                            rescheduleTime === time
                              ? 'border-gray-800 bg-gray-800 text-white shadow-md'
                              : 'border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 text-gray-800 shadow-sm'
                          }`}
                        >
                          <span className="text-sm">{time}</span>
                          {rescheduleTime === time && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsRescheduleModalOpen(false)
                      setSelectedAppointment(null)
                      setRescheduleDate(null)
                      setRescheduleTime('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReschedule}
                    disabled={!rescheduleDate || !rescheduleTime}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                      !rescheduleDate || !rescheduleTime
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-800">Delete Appointment</h2>
                </div>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedAppointment(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this appointment? This action cannot be undone.
                </p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-800">{selectedAppointment.patient}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedAppointment.service}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(parseISO(selectedAppointment.date), 'MMM d, yyyy')} at {selectedAppointment.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedAppointment(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Appointment</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Schedule
