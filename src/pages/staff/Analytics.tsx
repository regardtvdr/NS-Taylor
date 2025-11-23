import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3, TrendingUp, Users, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { format, isSameDay, addDays, subDays, parseISO } from 'date-fns'
import { DENTISTS } from '../../utils/constants'

interface Booking {
  id: string
  patient: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
}

const Analytics = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedDentist, setSelectedDentist] = useState<string>('all')

  // Mock bookings data - in a real app, this would come from an API
  const allBookings: Booking[] = [
    {
      id: 'BK-001',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '08:00',
      status: 'confirmed',
    },
    {
      id: 'BK-002',
      patient: 'James Thompson',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      status: 'confirmed',
    },
    {
      id: 'BK-003',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:30',
      status: 'confirmed',
    },
    {
      id: 'BK-004',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: 'BK-005',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:30',
      status: 'confirmed',
    },
    {
      id: 'BK-006',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '11:00',
      status: 'confirmed',
    },
    {
      id: 'BK-007',
      patient: 'Jennifer Martinez',
      service: 'Regular Checkup',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '13:00',
      status: 'confirmed',
    },
    {
      id: 'BK-008',
      patient: 'Robert Taylor',
      service: 'Teeth Cleaning',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '13:30',
      status: 'confirmed',
    },
    {
      id: 'BK-009',
      patient: 'Amanda White',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: 'BK-010',
      patient: 'Chris Green',
      service: 'Teeth Whitening',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:30',
      status: 'confirmed',
    },
    {
      id: 'BK-011',
      patient: 'Maria Garcia',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:00',
      status: 'confirmed',
    },
    {
      id: 'BK-012',
      patient: 'John Smith',
      service: 'Emergency Visit',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:30',
      status: 'confirmed',
    },
    {
      id: 'BK-013',
      patient: 'Sarah Connor',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '16:00',
      status: 'confirmed',
    },
  ]

  // Filter bookings for selected date and dentist
  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const matchesDate = (() => {
        try {
          return isSameDay(parseISO(booking.date), selectedDate)
        } catch {
          return false
        }
      })()
      const matchesDentist = selectedDentist === 'all' || booking.dentist === selectedDentist
      return matchesDate && matchesDentist
    })
  }, [selectedDate, selectedDentist, allBookings])

  // Group bookings by hour
  const bookingsByHour = useMemo(() => {
    const grouped: Record<string, Booking[]> = {}
    
    // Initialize all hours from 8:00 to 17:00
    for (let hour = 8; hour < 18; hour++) {
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      grouped[timeKey] = []
    }

    filteredBookings.forEach((booking) => {
      const hour = parseInt(booking.time.split(':')[0])
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      if (grouped[timeKey]) {
        grouped[timeKey].push(booking)
      }
    })

    return grouped
  }, [filteredBookings])

  // Group bookings by service type for pie chart
  const bookingsByService = useMemo(() => {
    const grouped: Record<string, number> = {}
    
    filteredBookings.forEach((booking) => {
      const service = booking.service
      grouped[service] = (grouped[service] || 0) + 1
    })

    return grouped
  }, [filteredBookings])

  // Calculate max bookings for scaling
  const maxBookings = useMemo(() => {
    const counts = Object.values(bookingsByHour).map((bookings) => bookings.length)
    return Math.max(...counts, 1)
  }, [bookingsByHour])

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => (direction === 'next' ? addDays(prev, 1) : subDays(prev, 1)))
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Pie Chart Component
  const PieChart = ({ data }: { data: Record<string, number> }) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0)
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No appointments to display</p>
        </div>
      )
    }

    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#F97316', // orange
    ]

    let currentAngle = -90 // Start from top
    const segments = Object.entries(data).map(([service, count], index) => {
      const percentage = (count / total) * 100
      const angle = (percentage / 100) * 360
      const startAngle = currentAngle
      currentAngle += angle

      const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
      const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
      const x2 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180)
      const y2 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180)

      const largeArc = angle > 180 ? 1 : 0

      return {
        service,
        count,
        percentage,
        path: `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`,
        color: colors[index % colors.length],
      }
    })

    return (
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="relative w-64 h-64 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {segments.map((segment, index) => (
              <motion.path
                key={segment.service}
                d={segment.path}
                fill={segment.color}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="stroke-white stroke-1"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
          </div>
        </div>
        <div className="space-y-3 min-w-[200px]">
          {segments.map((segment) => (
            <div key={segment.service} className="flex items-center space-x-3">
              <div
                className="w-5 h-5 rounded flex-shrink-0 border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{segment.service}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {segment.count} appointment{segment.count !== 1 ? 's' : ''} ({segment.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Enhanced Bar Chart Component
  const BarChart = ({ data, maxValue }: { data: Record<string, Booking[]>, maxValue: number }) => {
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([hour, bookings], index) => {
          const count = bookings.length
          const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0
          
          let barColor = 'bg-gray-200'
          let barBg = 'bg-gray-50'
          let textColor = 'text-gray-500'
          
          if (count > 0) {
            if (count <= 2) {
              barColor = 'bg-green-500'
              barBg = 'bg-green-50'
              textColor = 'text-green-700'
            } else if (count <= 4) {
              barColor = 'bg-yellow-500'
              barBg = 'bg-yellow-50'
              textColor = 'text-yellow-700'
            } else {
              barColor = 'bg-red-500'
              barBg = 'bg-red-50'
              textColor = 'text-red-700'
            }
          }
          
          return (
            <motion.div
              key={hour}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between mb-1">
                 <div className="flex items-center space-x-3">
                   <div className="w-16 text-sm font-semibold text-gray-800 dark:text-gray-100">{hour}</div>
                   <div className={`text-sm font-semibold ${textColor}`}>
                     {count} {count === 1 ? 'appointment' : 'appointments'}
                   </div>
                 </div>
                {count > 0 && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${barBg} ${textColor}`}>
                    {count <= 2 ? 'Low' : count <= 4 ? 'Medium' : 'High'}
                  </div>
                )}
              </div>
              <div className="relative h-10 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                  className={`h-full ${barColor} rounded-lg flex items-center justify-end pr-3 shadow-sm`}
                >
                  {count > 0 && (
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {count}
                    </span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  const totalAppointments = filteredBookings.length
  const peakHour = useMemo(() => {
    let maxCount = 0
    let peak = ''
    Object.entries(bookingsByHour).forEach(([hour, bookings]) => {
      if (bookings.length > maxCount) {
        maxCount = bookings.length
        peak = hour
      }
    })
    return { hour: peak, count: maxCount }
  }, [bookingsByHour])

  const selectedDentistName = selectedDentist === 'all' 
    ? 'All Dentists' 
    : DENTISTS.find(d => d.name === selectedDentist)?.name || 'All Dentists'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
                Analytics & Insights
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Hourly busyness analysis and staff workload</p>
            </div>
          </div>

          {/* Date Navigation and Filter */}
          <div className="card p-6 mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Date Navigation */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h2 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-100">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h2>
                  {!isSameDay(selectedDate, new Date()) && (
                    <button
                      onClick={goToToday}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
                    >
                      Today
                    </button>
                  )}
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Dentist Filter */}
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select
                  value={selectedDentist}
                  onChange={(e) => setSelectedDentist(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent"
                >
                  <option value="all">All Dentists</option>
                  {DENTISTS.map((dentist) => (
                    <option key={dentist.id} value={dentist.name}>
                      {dentist.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{totalAppointments}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Appointments</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{selectedDentistName}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-green-500 dark:border-l-green-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{peakHour.hour || 'N/A'}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Peak Hour</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{peakHour.count} appointments</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 dark:border-l-purple-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{maxBookings}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Hourly Load</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Busiest hour</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-orange-500 dark:border-l-orange-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {totalAppointments > 0 ? (totalAppointments / 10).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg per Hour</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Across 10 hours</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Busyness Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-6 h-6 text-gray-800 dark:text-gray-100" />
              <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">Hourly Busyness</h2>
            </div>
            <BarChart data={bookingsByHour} maxValue={maxBookings} />
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Low (1-2)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Medium (3-4)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">High (5+)</span>
              </div>
            </div>
          </motion.div>

          {/* Appointment Types Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-gray-800 dark:text-gray-100" />
              <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">Appointment Types</h2>
            </div>
            <PieChart data={bookingsByService} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
