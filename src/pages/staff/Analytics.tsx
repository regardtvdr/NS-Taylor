import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3, TrendingUp, Users, Filter, Download, DollarSign, AlertCircle } from 'lucide-react'
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { DENTISTS } from '../../utils/constants'
import 'react-day-picker/dist/style.css'

interface Booking {
  id: string
  patient: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  deposit?: number
  total?: number
}

type DateRangeType = 'today' | 'week' | 'month' | 'custom'

const Analytics = () => {
  const [_selectedDate, _setSelectedDate] = useState<Date>(new Date())
  const [selectedDentist, setSelectedDentist] = useState<string>('all')
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('today')
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null)
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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
      status: 'completed',
      deposit: 50,
      total: 850,
    },
    {
      id: 'BK-003',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:30',
      status: 'completed',
      deposit: 50,
      total: 2500,
    },
    {
      id: 'BK-004',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      status: 'completed',
      deposit: 50,
      total: 3500,
    },
    {
      id: 'BK-005',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:30',
      status: 'cancelled',
      deposit: 50,
      total: 950,
    },
    {
      id: 'BK-006',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '11:00',
      status: 'completed',
      deposit: 50,
      total: 1200,
    },
    {
      id: 'BK-007',
      patient: 'Jennifer Martinez',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '13:00',
      status: 'completed',
      deposit: 50,
      total: 650,
    },
    {
      id: 'BK-008',
      patient: 'Robert Taylor',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '13:30',
      status: 'completed',
      deposit: 50,
      total: 650,
    },
    {
      id: 'BK-009',
      patient: 'Amanda White',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      status: 'completed',
      deposit: 50,
      total: 850,
    },
    {
      id: 'BK-010',
      patient: 'Chris Green',
      service: 'Teeth Whitening',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:30',
      status: 'cancelled',
      deposit: 50,
      total: 2500,
    },
    {
      id: 'BK-011',
      patient: 'Maria Garcia',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Michael Chen',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:00',
      status: 'completed',
      deposit: 50,
      total: 3500,
    },
    {
      id: 'BK-012',
      patient: 'John Smith',
      service: 'Emergency Visit',
      dentist: 'Dr. Emily Williams',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '15:30',
      status: 'completed',
      deposit: 50,
      total: 950,
    },
    {
      id: 'BK-013',
      patient: 'Sarah Connor',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '16:00',
      status: 'completed',
      deposit: 50,
      total: 650,
    },
  ]

  // Calculate date range based on type
  const dateRange = useMemo(() => {
    switch (dateRangeType) {
      case 'today':
        return { start: new Date(), end: new Date() }
      case 'week':
        return { start: startOfWeek(new Date()), end: endOfWeek(new Date()) }
      case 'month':
        return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) }
      case 'custom':
        return {
          start: customStartDate || new Date(),
          end: customEndDate || new Date()
        }
      default:
        return { start: new Date(), end: new Date() }
    }
  }, [dateRangeType, customStartDate, customEndDate])

  // Filter bookings for selected date range and dentist
  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      try {
        const bookingDate = parseISO(booking.date)
        const matchesDate = bookingDate >= dateRange.start && bookingDate <= dateRange.end
        const matchesDentist = selectedDentist === 'all' || booking.dentist === selectedDentist
        return matchesDate && matchesDentist
      } catch {
        return false
      }
    })
  }, [dateRange, selectedDentist, allBookings])

  // Group bookings by hour (only for today view)
  const bookingsByHour = useMemo(() => {
    const grouped: Record<string, Booking[]> = {}
    
    // Initialize all hours from 8:00 to 17:00
    for (let hour = 8; hour < 18; hour++) {
      const timeKey = `${hour.toString().padStart(2, '0')}:00`
      grouped[timeKey] = []
    }

    // Only group by hour if viewing a single day
    if (dateRangeType === 'today') {
      filteredBookings.forEach((booking) => {
        const hour = parseInt(booking.time.split(':')[0])
        const timeKey = `${hour.toString().padStart(2, '0')}:00`
        if (grouped[timeKey]) {
          grouped[timeKey].push(booking)
        }
      })
    }

    return grouped
  }, [filteredBookings, dateRangeType])

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

  // Calculate revenue metrics
  const revenueMetrics = useMemo(() => {
    const completed = filteredBookings.filter(b => b.status === 'completed')
    const totalRevenue = completed.reduce((sum, b) => sum + (b.total || 0), 0)
    const totalDeposits = filteredBookings.reduce((sum, b) => sum + (b.deposit || 50), 0)
    const averageRevenue = completed.length > 0 ? totalRevenue / completed.length : 0
    const noShows = filteredBookings.filter(b => b.status === 'cancelled').length
    const noShowRate = filteredBookings.length > 0 ? (noShows / filteredBookings.length) * 100 : 0

    return {
      totalRevenue,
      totalDeposits,
      averageRevenue,
      noShows,
      noShowRate,
      completedCount: completed.length
    }
  }, [filteredBookings])

  // Dentist performance metrics
  const dentistMetrics = useMemo(() => {
    const metrics: Record<string, { appointments: number, revenue: number, noShows: number }> = {}
    
    filteredBookings.forEach(booking => {
      if (!metrics[booking.dentist]) {
        metrics[booking.dentist] = { appointments: 0, revenue: 0, noShows: 0 }
      }
      metrics[booking.dentist].appointments++
      if (booking.status === 'completed') {
        metrics[booking.dentist].revenue += booking.total || 0
      }
      if (booking.status === 'cancelled') {
        metrics[booking.dentist].noShows++
      }
    })

    return metrics
  }, [filteredBookings])


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

          {/* Date Range and Filters */}
          <div className="card p-6 mb-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Date Range Selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setDateRangeType('today')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        dateRangeType === 'today'
                          ? 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setDateRangeType('week')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        dateRangeType === 'week'
                          ? 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setDateRangeType('month')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        dateRangeType === 'month'
                          ? 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => {
                        setDateRangeType('custom')
                        setIsCalendarOpen(!isCalendarOpen)
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        dateRangeType === 'custom'
                          ? 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>
                {dateRangeType === 'custom' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {customStartDate ? format(customStartDate, 'MMM d, yyyy') : 'Start date'}
                    </span>
                    <span>to</span>
                    <span>
                      {customEndDate ? format(customEndDate, 'MMM d, yyyy') : 'End date'}
                    </span>
                  </div>
                )}
                {dateRangeType !== 'custom' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {format(dateRange.start, 'MMM d')} - {format(dateRange.end, 'MMM d, yyyy')}
                  </div>
                )}
              </div>

              {/* Dentist Filter and Export */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <select
                    value={selectedDentist}
                    onChange={(e) => setSelectedDentist(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent text-sm"
                  >
                    <option value="all">All Dentists</option>
                    {DENTISTS.map((dentist) => (
                      <option key={dentist.id} value={dentist.name}>
                        {dentist.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (dateRangeType === 'custom') {
                        setIsCalendarOpen(!isCalendarOpen)
                      } else {
                        // Quick export menu
                        const menu = document.createElement('div')
                        menu.className = 'absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50'
                        menu.innerHTML = `
                          <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export CSV</button>
                          <button class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export JSON</button>
                        `
                        document.body.appendChild(menu)
                        setTimeout(() => document.body.removeChild(menu), 100)
                      }
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Export data"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Date Range Picker */}
            {dateRangeType === 'custom' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                    <DayPicker
                      mode="single"
                      selected={customStartDate || undefined}
                      onSelect={(date) => {
                        setCustomStartDate(date || null)
                        if (date && customEndDate && date > customEndDate) {
                          setCustomEndDate(null)
                        }
                      }}
                      className="mx-auto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                    <DayPicker
                      mode="single"
                      selected={customEndDate || undefined}
                      onSelect={(date) => {
                        if (date && customStartDate && date >= customStartDate) {
                          setCustomEndDate(date || null)
                        } else if (date) {
                          setCustomEndDate(date || null)
                        }
                      }}
                      disabled={customStartDate ? { before: customStartDate } : undefined}
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">R{revenueMetrics.totalRevenue.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Revenue</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">R{revenueMetrics.averageRevenue.toFixed(0)} avg per visit</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-purple-500 dark:border-l-purple-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{peakHour.hour || 'N/A'}</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Peak Hour</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{peakHour.count} appointments</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 bg-white dark:bg-gray-800 border-l-4 border-l-red-500 dark:border-l-red-400 shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{revenueMetrics.noShowRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">No-Show Rate</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{revenueMetrics.noShows} no-shows</div>
          </motion.div>
        </div>

        {/* Dentist Performance */}
        {selectedDentist === 'all' && Object.keys(dentistMetrics).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 bg-white dark:bg-gray-800 mb-8"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100 mb-6">Dentist Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(dentistMetrics).map(([dentist, metrics]) => (
                <div key={dentist} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{dentist}</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Appointments:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{metrics.appointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">R{metrics.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">No-Shows:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{metrics.noShows}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
