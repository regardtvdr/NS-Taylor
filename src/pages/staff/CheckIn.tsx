import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, User, Search, Calendar } from 'lucide-react'
import { format, isToday, parseISO } from 'date-fns'
import { useToast } from '../../contexts/ToastContext'
import { useBookings } from '../../hooks/useBookings'
import { useFilteredDentists } from '../../hooks/useFilteredDentists'

const CheckIn = () => {
  const { showToast } = useToast()
  const today = format(new Date(), 'yyyy-MM-dd')
  const [selectedDate, setSelectedDate] = useState<string>(today)
  
  // Reset to today on mount to ensure we always show today's bookings
  useEffect(() => {
    const currentToday = format(new Date(), 'yyyy-MM-dd')
    setSelectedDate(currentToday)
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDentist, setFilterDentist] = useState<string>('all')
  const { bookings, updateBookingStatus } = useBookings({ filterByUserPractices: true })
  const { dentists: DENTISTS } = useFilteredDentists()
  
  // Convert bookings to appointments - ONLY show appointments for today
  const appointments = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    
    return bookings
      .filter(b => {
        // Only show appointments that are happening TODAY
        if (!b.date) return false
        // Strict check - must be today's date
        return b.date === todayStr && (b.status === 'confirmed' || b.status === 'pending' || b.status === 'arrived' || b.status === 'no-show')
      })
      .map(b => ({
        id: b.id,
        time: b.time,
        patient: b.patient,
        service: b.service,
        dentist: b.dentist,
        status: b.status === 'confirmed' || b.status === 'pending' ? 'scheduled' as const : b.status === 'arrived' ? 'arrived' as const : 'no-show' as const,
        phone: b.phone,
        email: b.email,
        date: b.date,
      }))
  }, [bookings])

  // Filter appointments by date, search query, and dentist
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.date === selectedDate)
      .filter((apt) => {
        if (filterDentist === 'all') return true
        return apt.dentist === filterDentist
      })
      .filter((apt) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          apt.patient.toLowerCase().includes(query) ||
          apt.service.toLowerCase().includes(query) ||
          apt.phone?.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [appointments, selectedDate, searchQuery, filterDentist])

  // Group appointments by dentist
  const appointmentsByDentist = useMemo(() => {
    const grouped: Record<string, typeof appointments> = {}
    DENTISTS.forEach((dentist) => {
      grouped[dentist.name] = filteredAppointments.filter((apt) => apt.dentist === dentist.name)
    })
    return grouped
  }, [filteredAppointments, DENTISTS])

  const handleMarkArrived = async (id: string) => {
    try {
      await updateBookingStatus(id, 'arrived')
      const apt = appointments.find((a) => a.id === id)
      showToast(`${apt?.patient} marked as arrived! 🎉`, 'success')
    } catch (error) {
      console.error('Failed to update booking status:', error)
      showToast('Failed to mark as arrived', 'error')
    }
  }

  const handleMarkNoShow = async (id: string) => {
    try {
      await updateBookingStatus(id, 'no-show')
      const apt = appointments.find((a) => a.id === id)
      showToast(`${apt?.patient} marked as no-show`, 'warning')
    } catch (error) {
      console.error('Failed to update booking status:', error)
      showToast('Failed to mark as no-show', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700'
      case 'no-show':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
    }
  }

  const scheduledCount = filteredAppointments.filter((apt) => apt.status === 'scheduled').length
  const arrivedCount = filteredAppointments.filter((apt) => apt.status === 'arrived').length
  const noShowCount = filteredAppointments.filter((apt) => apt.status === 'no-show').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
                Check In
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mark patients as arrived or no-show for their appointments
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  // Handle empty value (when calendar clear button is clicked)
                  if (!e.target.value) {
                    setSelectedDate(today)
                    return
                  }
                  setSelectedDate(e.target.value)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-600 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{scheduledCount}</p>
                </div>
                <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-300 dark:border-green-600 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arrived</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{arrivedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400 dark:text-green-500" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-300 dark:border-red-600 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No-Show</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{noShowCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400 dark:text-red-500" />
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by patient name, service, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
              />
            </div>
            <select
              value={filterDentist}
              onChange={(e) => setFilterDentist(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
            >
              <option value="all">All Dentists</option>
              {DENTISTS.map((dentist) => (
                <option key={dentist.id} value={dentist.name}>
                  {dentist.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600"
          >
            <Clock className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">No appointments found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchQuery || filterDentist !== 'all'
                ? 'Try adjusting your search or filters'
                : selectedDate && parseISO(selectedDate)
                ? isToday(parseISO(selectedDate))
                  ? `No appointments scheduled for today`
                  : `Appointments are only visible on the day of the booking. Please select today's date.`
                : `No appointments scheduled for today`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filterDentist === 'all' ? (
              // Grouped by dentist view
              DENTISTS.map((dentist, index) => {
                const dentistAppointments = appointmentsByDentist[dentist.name] || []
                if (dentistAppointments.length === 0) return null

                return (
                  <motion.div
                    key={dentist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                      <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">
                        {dentist.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dentistAppointments.length} appointment{dentistAppointments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {dentistAppointments.map((apt) => (
                        <motion.div
                          key={apt.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {apt.patient}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                    {apt.status === 'arrived'
                                      ? 'Arrived'
                                      : apt.status === 'no-show'
                                      ? 'No-Show'
                                      : 'Scheduled'}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-1">{apt.service}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{apt.time}</span>
                                  </div>
                                  {apt.phone && (
                                    <div className="flex items-center space-x-1">
                                      <span>{apt.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              {apt.status === 'scheduled' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMarkArrived(apt.id)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Arrived</span>
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMarkNoShow(apt.id)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span>No Show</span>
                                  </motion.button>
                                </>
                              )}
                              {apt.status === 'arrived' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkNoShow(apt.id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Mark No Show</span>
                                </motion.button>
                              )}
                              {apt.status === 'no-show' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkArrived(apt.id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Mark Arrived</span>
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })
            ) : (
              // Single dentist view
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden"
              >
                <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">
                    {filterDentist}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAppointments.map((apt) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {apt.patient}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                {apt.status === 'arrived'
                                  ? 'Arrived'
                                  : apt.status === 'no-show'
                                  ? 'No-Show'
                                  : 'Scheduled'}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-1">{apt.service}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{apt.time}</span>
                              </div>
                              {apt.phone && (
                                <div className="flex items-center space-x-1">
                                  <span>{apt.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {apt.status === 'scheduled' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMarkArrived(apt.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Arrived</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMarkNoShow(apt.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>No Show</span>
                              </motion.button>
                            </>
                          )}
                          {apt.status === 'arrived' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMarkNoShow(apt.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Mark No Show</span>
                            </motion.button>
                          )}
                          {apt.status === 'no-show' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMarkArrived(apt.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Mark Arrived</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckIn

