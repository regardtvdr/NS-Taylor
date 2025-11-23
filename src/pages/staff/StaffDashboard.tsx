import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, CreditCard, TrendingUp, Clock, User, Plus, Phone, MessageCircle, CheckCircle, Search, AlertCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format, isSameDay, parseISO } from 'date-fns'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import BookingDetailModal from '../../components/staff/BookingDetailModal'
import { AnimatedCounter } from '../../components/ui/AnimatedCounter'
import { useToast } from '../../contexts/ToastContext'
import { playSound } from '../../utils/sounds'
import 'react-day-picker/dist/style.css'

interface Booking {
  id: string
  patient: string
  service: string
  time: string
  dentist: string
  status: 'confirmed' | 'pending' | 'arrived'
  date?: string
  phone?: string
  deposit?: number
  total?: number
}

const StaffDashboard = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const { showToast } = useToast()

  // Mock data - in production, this would come from Firestore
  const [allBookings, setAllBookings] = useState<Booking[]>([
    {
      id: '1',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning',
      time: '09:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 82 123 4567',
      deposit: 50,
      total: 650,
    },
    {
      id: '2',
      patient: 'James Thompson',
      service: 'Comprehensive Consultation',
      time: '10:30',
      dentist: 'Dr. Michael Chen',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 83 234 5678',
      deposit: 50,
      total: 850,
    },
    {
      id: '3',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      time: '11:00',
      dentist: 'Dr. Emily Williams',
      status: 'pending',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 84 345 6789',
      deposit: 50,
      total: 2500,
    },
    {
      id: '4',
      patient: 'Michael Brown',
      service: 'Root Canal',
      time: '13:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 85 456 7890',
      deposit: 50,
      total: 3500,
    },
    {
      id: '5',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      time: '14:30',
      dentist: 'Dr. Michael Chen',
      status: 'arrived',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 86 567 8901',
      deposit: 50,
      total: 950,
    },
    {
      id: '6',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      time: '15:00',
      dentist: 'Dr. Emily Williams',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 87 678 9012',
      deposit: 50,
      total: 1200,
    },
    {
      id: '7',
      patient: 'Jennifer Martinez',
      service: 'Regular Checkup',
      time: '16:00',
      dentist: 'Dr. Sarah Johnson',
      status: 'confirmed',
      date: format(new Date(), 'yyyy-MM-dd'),
      phone: '+27 88 789 0123',
      deposit: 50,
      total: 650,
    },
  ])

  // Calculate metrics
  const todayBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (!b.date) return false
      try {
        return isSameDay(parseISO(b.date), new Date())
      } catch {
        return false
      }
    })
  }, [allBookings])

  const metrics = useMemo(() => {
    const revenue = todayBookings.reduce((sum, b) => sum + (b.total || 0), 0)
    const deposits = todayBookings.reduce((sum, b) => sum + (b.deposit || 0), 0)
    const noShowsSaved = todayBookings.filter((b) => b.status === 'arrived').length
    const noShowValue = noShowsSaved * 650 // Average appointment value saved

    return {
      todayAppointments: todayBookings.length,
      revenue,
      depositsCollected: deposits,
      noShowsSaved: noShowValue,
    }
  }, [todayBookings])

  // Get next 7 appointments
  const nextAppointments = useMemo(() => {
    return todayBookings
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 7)
  }, [todayBookings])

  // Calendar helpers
  const datesWithBookings = useMemo(() => {
    const dates = new Set<string>()
    allBookings.forEach((booking) => {
      if (booking.date) {
        dates.add(booking.date)
      }
    })
    return dates
  }, [allBookings])

  const getBookingCountForDate = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return allBookings.filter((b) => b.date === dateStr).length
  }

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
      phone: newBooking.phone,
      deposit: newBooking.deposit,
      total: newBooking.total,
    }
    setAllBookings((prev) => [...prev, appointment])
    // playSound('success')
    showToast('Booking created successfully!', 'success')
  }

  const handleQuickAction = (action: 'call' | 'whatsapp' | 'arrived', bookingId: string) => {
    // playSound('click')
    if (action === 'arrived') {
      setAllBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'arrived' as const } : b))
      )
      // playSound('success')
      showToast('Patient marked as arrived!', 'success')
    } else {
      showToast(`${action === 'call' ? 'Calling' : 'Opening WhatsApp'}...`, 'info')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-100">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/staff/today')
                // playSound('click')
              }}
              className="flex items-center space-x-2 shadow-lg bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 font-semibold py-3.5 px-6 rounded-button transition-all duration-300"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Emergency Booking</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate('/staff/schedule?view=patients')
                // playSound('click')
              }}
              className="flex items-center space-x-2 shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-2 border-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3.5 px-6 rounded-button transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              <span>Book Existing Patient</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsCreateModalOpen(true)
                // playSound('click')
              }}
              className="btn-staff-primary flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create Booking</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 4 Huge Animated Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Today's Appointments",
              value: metrics.todayAppointments,
              icon: Calendar,
              color: 'from-gray-600 to-gray-700',
              bgColor: 'bg-gray-100',
              iconColor: 'text-gray-700',
            },
            {
              label: 'Revenue Today',
              value: metrics.revenue,
              icon: DollarSign,
              color: 'from-teal-500 to-teal-600',
              bgColor: 'bg-teal-50',
              iconColor: 'text-teal-600',
              prefix: 'R',
              suffix: '',
            },
            {
              label: 'Deposits Collected',
              value: metrics.depositsCollected,
              icon: CreditCard,
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
              prefix: 'R',
              suffix: '',
            },
            {
              label: 'No-Shows Saved',
              value: metrics.noShowsSaved,
              icon: TrendingUp,
              color: 'from-green-500 to-green-600',
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600',
              prefix: 'R',
              suffix: '',
            },
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card p-6 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 ${metric.bgColor} dark:bg-gray-700 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${metric.iconColor} dark:text-gray-300`} />
                  </div>
                </div>
                <div className="mb-2">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix || ''}
                    suffix={metric.suffix || ''}
                    className="text-4xl font-bold text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Next 7 Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 bg-white dark:bg-gray-800"
            >
              <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100 mb-6">
                Next 7 Appointments
              </h2>
              <div className="space-y-3">
                {nextAppointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>No appointments scheduled for today</p>
                  </div>
                ) : (
                  nextAppointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      onClick={() => {
                        setSelectedBooking(apt)
                        setIsDetailModalOpen(true)
                      }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex flex-col items-center min-w-[60px]">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 mb-1" />
                          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{apt.time}</span>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{apt.patient}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{apt.service}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{apt.dentist}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'arrived'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : apt.status === 'confirmed'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              : 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-4 relative z-10" onClick={(e) => e.stopPropagation()}>
                        {apt.phone && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickAction('call', apt.id)
                              }}
                              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors relative z-10"
                              title="Call"
                            >
                              <Phone className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleQuickAction('whatsapp', apt.id)
                              }}
                              className="p-2 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors relative z-10"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 text-green-700 dark:text-green-300" />
                            </motion.button>
                          </>
                        )}
                        {apt.status !== 'arrived' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickAction('arrived', apt.id)
                            }}
                            className="p-2 bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-lg transition-colors relative z-10"
                            title="Mark Arrived"
                          >
                            <CheckCircle className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Mini Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-white dark:bg-gray-800"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100 mb-6">Calendar</h2>
            <div className="calendar-wrapper">
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
                  selected: 'bg-navy-900 text-white rounded-full font-semibold',
                  manyBookings: 'bg-red-50 hover:bg-red-100 border-red-200',
                  mediumBookings: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
                  fewBookings: 'bg-green-50 hover:bg-green-100 border-green-200',
                }}
                className="mx-auto"
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
                .dark .calendar-wrapper .rdp {
                  --rdp-accent-color: #9ca3af;
                  --rdp-background-color: #1f2937;
                  --rdp-accent-color-dark: #6b7280;
                  --rdp-background-color-dark: #111827;
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
                .dark .calendar-wrapper .rdp-head_cell {
                  color: #9ca3af;
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
                .dark .calendar-wrapper .rdp-day {
                  color: #e5e7eb;
                }
                .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                  background-color: #f3f4f6;
                  border-color: #d1d5db;
                  color: #111827;
                }
                .dark .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                  background-color: #374151;
                  border-color: #4b5563;
                  color: #f3f4f6;
                }
                .calendar-wrapper .rdp-day_selected {
                  background-color: #0D47A1 !important;
                  color: white !important;
                  font-weight: 600;
                }
                .calendar-wrapper .rdp-day_today {
                  font-weight: 700;
                  color: #1f2937;
                }
                .dark .calendar-wrapper .rdp-day_today {
                  color: #e5e7eb;
                }
                .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
                  border: 2px solid #6b7280;
                }
                .dark .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
                  border: 2px solid #9ca3af;
                }
                .calendar-wrapper .rdp-day_disabled {
                  color: #d1d5db;
                  opacity: 0.5;
                }
                .dark .calendar-wrapper .rdp-day_disabled {
                  color: #4b5563;
                }
                .calendar-wrapper .rdp-caption {
                  font-weight: 600;
                  font-size: 16px;
                  color: #111827;
                  padding: 8px 0;
                  margin-bottom: 8px;
                }
                .dark .calendar-wrapper .rdp-caption {
                  color: #f3f4f6;
                }
                .calendar-wrapper .rdp-button {
                  color: #374151;
                }
                .dark .calendar-wrapper .rdp-button {
                  color: #9ca3af;
                }
                .calendar-wrapper .rdp-button:hover {
                  background-color: #f3f4f6;
                }
                .dark .calendar-wrapper .rdp-button:hover {
                  background-color: #374151;
                }
                .calendar-wrapper .rdp-nav_button {
                  width: 32px;
                  height: 32px;
                }
                .calendar-wrapper .rdp-nav_button:hover {
                  background-color: #f3f4f6;
                  border-radius: 6px;
                }
                .dark .calendar-wrapper .rdp-nav_button:hover {
                  background-color: #374151;
                }
              `}</style>
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold text-gray-800 dark:text-gray-100">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </p>
              {hasBookings(selectedDate) && (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {getBookingCountForDate(selectedDate)} {getBookingCountForDate(selectedDate) === 1 ? 'appointment' : 'appointments'}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateBooking}
      />

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking ? {
          id: selectedBooking.id,
          patient: selectedBooking.patient,
          email: selectedBooking.email || '',
          phone: selectedBooking.phone || '',
          service: selectedBooking.service,
          dentist: selectedBooking.dentist,
          date: selectedBooking.date || format(new Date(), 'yyyy-MM-dd'),
          time: selectedBooking.time,
          status: selectedBooking.status === 'arrived' ? 'confirmed' : selectedBooking.status,
          deposit: selectedBooking.deposit || 0,
          total: selectedBooking.total || 0,
        } : null}
      />
    </div>
  )
}

export default StaffDashboard

