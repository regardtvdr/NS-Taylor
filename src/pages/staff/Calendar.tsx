import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User, X } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from 'date-fns'
import { DENTISTS } from '../../utils/constants'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import { useToast } from '../../contexts/ToastContext'
import { playSound } from '../../utils/sounds'

interface Booking {
  id: string
  patient: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  phone?: string
}

interface LeaveDay {
  date: string
  dentist: string
  reason?: string
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDentist, setSelectedDentist] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [leaveDays, setLeaveDays] = useState<LeaveDay[]>([])
  const { showToast } = useToast()

  // Mock bookings data
  const [allBookings, setAllBookings] = useState<Booking[]>([
    {
      id: '1',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      status: 'confirmed',
      phone: '+27 82 123 4567',
    },
    {
      id: '2',
      patient: 'James Thompson',
      service: 'Consultation',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:30',
      status: 'confirmed',
      phone: '+27 83 234 5678',
    },
    {
      id: '3',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      status: 'confirmed',
      phone: '+27 84 345 6789',
    },
    {
      id: '4',
      patient: 'Michael Brown',
      service: 'Root Canal',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      time: '11:00',
      status: 'confirmed',
      phone: '+27 85 456 7890',
    },
  ])

  // Generate time slots (8 AM to 5 PM, 30-min intervals)
  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }, [])

  // Get bookings for selected date and dentist
  const dayBookings = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    return allBookings.filter((booking) => {
      const matchesDate = booking.date === dateStr
      const matchesDentist = selectedDentist === 'all' || booking.dentist === selectedDentist
      return matchesDate && matchesDentist
    })
  }, [selectedDate, selectedDentist, allBookings])

  // Get bookings grouped by time slot
  const bookingsByTime = useMemo(() => {
    const grouped: Record<string, Booking[]> = {}
    dayBookings.forEach((booking) => {
      if (!grouped[booking.time]) {
        grouped[booking.time] = []
      }
      grouped[booking.time].push(booking)
    })
    return grouped
  }, [dayBookings])

  // Get all dates in current month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Get bookings count for a date
  const getBookingCount = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return allBookings.filter((b) => {
      const matchesDate = b.date === dateStr
      const matchesDentist = selectedDentist === 'all' || b.dentist === selectedDentist
      return matchesDate && matchesDentist
    }).length
  }

  // Check if date has bookings
  const hasBookings = (date: Date): boolean => {
    return getBookingCount(date) > 0
  }

  // Check if date is blacklisted/leave
  const isLeaveDay = (date: Date, dentist: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return leaveDays.some((leave) => leave.date === dateStr && (leave.dentist === dentist || selectedDentist === 'all'))
  }

  // Check if date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if date is more than 2 months in advance
  const isTooFarInFuture = (date: Date): boolean => {
    const twoMonthsFromNow = addMonths(new Date(), 2)
    return date > twoMonthsFromNow
  }

  // Check if time slot is available
  const isTimeSlotAvailable = (time: string, dentist: string): boolean => {
    if (!selectedDate) return false
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    
    // Check if dentist is on leave
    if (isLeaveDay(selectedDate, dentist)) return false
    
    // Check if slot is already booked
    const isBooked = allBookings.some(
      (b) => b.date === dateStr && b.time === time && b.dentist === dentist && b.status !== 'cancelled'
    )
    
    return !isBooked
  }

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) || isTooFarInFuture(date)) return
    setSelectedDate(date)
    playSound('click')
  }

  const handleQuickBook = (time: string, dentist: string) => {
    if (!selectedDate) return
    setSelectedTimeSlot(time)
    setIsCreateModalOpen(true)
    playSound('click')
  }

  const handleCreateBooking = (newBooking: any) => {
    const booking: Booking = {
      id: newBooking.id,
      patient: newBooking.patient,
      service: newBooking.service,
      dentist: newBooking.dentist,
      date: newBooking.date || format(selectedDate!, 'yyyy-MM-dd'),
      time: newBooking.time || selectedTimeSlot || '',
      status: newBooking.status || 'confirmed',
      phone: newBooking.phone,
    }
    setAllBookings((prev) => [...prev, booking])
    playSound('success')
    showToast('Booking created successfully!', 'success')
    setSelectedTimeSlot(null)
  }

  const handleAddLeave = (date: Date, dentist: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const existingLeave = leaveDays.find((l) => l.date === dateStr && l.dentist === dentist)
    
    if (existingLeave) {
      setLeaveDays((prev) => prev.filter((l) => !(l.date === dateStr && l.dentist === dentist)))
      showToast('Leave day removed', 'info')
    } else {
      setLeaveDays((prev) => [...prev, { date: dateStr, dentist, reason: 'Leave' }])
      showToast('Leave day added', 'success')
    }
    playSound('click')
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => (direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  // Get week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Get first day of month offset
  const firstDayOfMonth = startOfMonth(currentMonth).getDay()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
                Calendar View
              </h1>
              <p className="text-gray-600">Manage appointments and view availability</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedDentist}
                onChange={(e) => setSelectedDentist(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="all">All Dentists</option>
                {DENTISTS.map((dentist) => (
                  <option key={dentist.id} value={dentist.name}>
                    {dentist.name}
                  </option>
                ))}
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToToday}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-800 transition-colors"
              >
                Today
              </motion.button>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="card p-4 bg-white mb-6">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <h2 className="text-2xl font-display font-bold text-gray-800">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 bg-white"
            >
              {/* Week Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Month days */}
                {monthDays.map((date) => {
                  const bookingCount = getBookingCount(date)
                  const isSelected = selectedDate && isSameDay(date, selectedDate)
                  const isToday = isSameDay(date, new Date())
                  const isPast = isPastDate(date)
                  const isTooFar = isTooFarInFuture(date)
                  const isLeave = selectedDentist === 'all' 
                    ? leaveDays.some(l => l.date === format(date, 'yyyy-MM-dd'))
                    : isLeaveDay(date, selectedDentist)

                  return (
                    <motion.button
                      key={date.toISOString()}
                      whileHover={!isPast && !isTooFar ? { scale: 1.05 } : {}}
                      whileTap={!isPast && !isTooFar ? { scale: 0.95 } : {}}
                      onClick={() => handleDateClick(date)}
                      disabled={isPast || isTooFar}
                      className={`
                        aspect-square p-2 rounded-lg border-2 transition-all relative
                        ${isSelected ? 'border-gray-800 bg-gray-100' : 'border-gray-200'}
                        ${isToday ? 'ring-2 ring-gray-400' : ''}
                        ${isPast ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:border-gray-400 hover:bg-gray-50'}
                        ${isTooFar ? 'opacity-40 cursor-not-allowed' : ''}
                        ${isLeave ? 'bg-red-50 border-red-300' : ''}
                      `}
                    >
                      <div className="text-sm font-semibold text-gray-800 mb-1">
                        {format(date, 'd')}
                      </div>
                      {bookingCount > 0 && (
                        <div className="flex items-center justify-center space-x-0.5">
                          {Array.from({ length: Math.min(bookingCount, 3) }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-gray-600"
                            />
                          ))}
                          {bookingCount > 3 && (
                            <span className="text-xs text-gray-600 ml-0.5">+{bookingCount - 3}</span>
                          )}
                        </div>
                      )}
                      {isLeave && (
                        <div className="absolute top-1 right-1 flex items-center">
                          <X className="w-3 h-3 text-red-600" />
                          {selectedDentist === 'all' && (
                            <span className="text-[8px] text-red-600 ml-0.5">
                              {leaveDays.filter(l => l.date === format(date, 'yyyy-MM-dd')).length}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-gray-600">Has bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-50 border-2 border-red-300 rounded"></div>
                  <span className="text-gray-600">Leave/Vacation</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Day Details Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card p-6 bg-white"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-gray-800">
                        {format(selectedDate, 'EEEE, MMMM d')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(selectedDate, 'yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Leave Management */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    {selectedDentist === 'all' ? (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 mb-2">Select a dentist to manage leave days</p>
                        {DENTISTS.map((dentist) => {
                          const isOnLeave = isLeaveDay(selectedDate, dentist.name)
                          return (
                            <button
                              key={dentist.id}
                              onClick={() => handleAddLeave(selectedDate, dentist.name)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                isOnLeave
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              }`}
                            >
                              {isOnLeave ? `Remove ${dentist.name} Leave` : `Mark ${dentist.name} Leave`}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddLeave(selectedDate, selectedDentist)}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isLeaveDay(selectedDate, selectedDentist)
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {isLeaveDay(selectedDate, selectedDentist) ? 'Remove Leave Day' : 'Mark as Leave Day'}
                      </button>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => {
                      const bookingsAtTime = bookingsByTime[time] || []
                      
                      // Get available dentists for this time slot
                      const availableDentists = DENTISTS.filter((dentist) => {
                        if (selectedDentist !== 'all' && dentist.name !== selectedDentist) return false
                        return isTimeSlotAvailable(time, dentist.name)
                      })

                      // Get dentists that are on leave at this time
                      const dentistsOnLeave = selectedDentist !== 'all' 
                        ? (isLeaveDay(selectedDate, selectedDentist) ? [selectedDentist] : [])
                        : DENTISTS.filter(d => isLeaveDay(selectedDate, d.name)).map(d => d.name)

                      return (
                        <div key={time} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-800">{time}</span>
                            </div>
                            {bookingsAtTime.length > 0 && (
                              <span className="text-xs text-gray-600">
                                {bookingsAtTime.length} booking{bookingsAtTime.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>

                          {/* Bookings at this time */}
                          {bookingsAtTime.length > 0 && (
                            <div className="space-y-2 mb-2">
                              {bookingsAtTime.map((booking) => (
                                <div
                                  key={booking.id}
                                  className="p-2 bg-blue-50 border border-blue-200 rounded text-sm"
                                >
                                  <div className="font-medium text-gray-800">{booking.patient}</div>
                                  <div className="text-xs text-gray-600">{booking.service}</div>
                                  <div className="text-xs text-gray-500">{booking.dentist}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Available slots */}
                          {availableDentists.length > 0 && (
                            <div className="space-y-1">
                              {availableDentists.map((dentist) => (
                                <motion.button
                                  key={dentist.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleQuickBook(time, dentist.name)}
                                  className="w-full py-2 px-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-sm font-medium text-green-800 transition-colors flex items-center justify-center space-x-2"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Book {dentist.name}</span>
                                </motion.button>
                              ))}
                            </div>
                          )}

                          {/* Show leave status */}
                          {dentistsOnLeave.length > 0 && availableDentists.length === 0 && bookingsAtTime.length === 0 && (
                            <div className="text-xs text-red-600 text-center py-2 bg-red-50 rounded">
                              {selectedDentist === 'all' 
                                ? `${dentistsOnLeave.length} dentist${dentistsOnLeave.length > 1 ? 's' : ''} on leave`
                                : 'Dentist on leave'}
                            </div>
                          )}

                          {bookingsAtTime.length === 0 && availableDentists.length === 0 && dentistsOnLeave.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-2">
                              No availability
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card p-6 bg-white"
                >
                  <div className="text-center py-12">
                    <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a date to view bookings</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedTimeSlot(null)
        }}
        onSave={handleCreateBooking}
        initialDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined}
        initialTime={selectedTimeSlot || undefined}
        initialDentist={selectedDentist !== 'all' ? selectedDentist : undefined}
      />
    </div>
  )
}

export default Calendar

