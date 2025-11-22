import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Calendar, Clock, User, DollarSign, Plus, Eye, Grid3x3, List } from 'lucide-react'
import { format } from 'date-fns'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import BookingDetailModal from '../../components/staff/BookingDetailModal'
import { DENTISTS } from '../../utils/constants'

interface Booking {
  id: string
  patient: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  deposit: number
  total: number
  email?: string
  phone?: string
  notes?: string
  createdAt?: string
}

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [dentistFilter, setDentistFilter] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'split'>('list')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-001',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      date: '2024-02-15',
      time: '09:00',
      status: 'confirmed',
      deposit: 50,
      total: 650,
      email: 'sarah.mitchell@email.com',
      phone: '+27 82 123 4567',
      notes: 'Patient prefers morning appointments',
      createdAt: '2024-02-10T08:30:00',
    },
    {
      id: 'BK-002',
      patient: 'James Thompson',
      service: 'Comprehensive Consultation',
      dentist: 'Dr. Michael Chen',
      date: '2024-02-15',
      time: '10:30',
      status: 'confirmed',
      deposit: 50,
      total: 850,
      email: 'james.thompson@email.com',
      phone: '+27 83 234 5678',
      notes: '',
      createdAt: '2024-02-11T14:20:00',
    },
    {
      id: 'BK-003',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      date: '2024-02-16',
      time: '14:00',
      status: 'pending',
      deposit: 50,
      total: 2500,
      email: 'emma.wilson@email.com',
      phone: '+27 84 345 6789',
      notes: 'First time patient',
      createdAt: '2024-02-12T09:15:00',
    },
    {
      id: 'BK-004',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      date: '2024-02-17',
      time: '11:00',
      status: 'confirmed',
      deposit: 50,
      total: 3500,
      email: 'michael.brown@email.com',
      phone: '+27 85 456 7890',
      notes: 'Follow-up appointment',
      createdAt: '2024-02-13T11:45:00',
    },
    {
      id: 'BK-005',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      date: '2024-02-18',
      time: '15:30',
      status: 'cancelled',
      deposit: 50,
      total: 950,
      email: 'lisa.anderson@email.com',
      phone: '+27 86 567 8901',
      notes: 'Cancelled by patient',
      createdAt: '2024-02-14T10:00:00',
    },
    {
      id: 'BK-006',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      date: '2024-02-19',
      time: '09:30',
      status: 'completed',
      deposit: 50,
      total: 1200,
      email: 'david.lee@email.com',
      phone: '+27 87 678 9012',
      notes: '',
      createdAt: '2024-02-15T16:30:00',
    },
  ])

  const handleCreateBooking = (newBooking: any) => {
    const booking: Booking = {
      id: newBooking.id,
      patient: newBooking.patient,
      service: newBooking.service,
      dentist: newBooking.dentist,
      date: newBooking.date,
      time: newBooking.time,
      status: newBooking.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
      deposit: newBooking.deposit,
      total: newBooking.total,
      email: newBooking.email,
      phone: newBooking.phone,
      notes: newBooking.notes,
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [booking, ...prev])
  }

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesDentist = dentistFilter === 'all' || booking.dentist === dentistFilter
      
      let matchesDate = true
      if (selectedDate) {
        matchesDate = booking.date === format(selectedDate, 'yyyy-MM-dd')
      } else if (dateFilter !== 'all') {
        matchesDate =
          (dateFilter === 'today' && booking.date === format(new Date(), 'yyyy-MM-dd')) ||
          (dateFilter === 'upcoming' && new Date(booking.date) > new Date()) ||
          (dateFilter === 'past' && new Date(booking.date) < new Date())
      }

      return matchesSearch && matchesStatus && matchesDate && matchesDentist
    })
  }, [searchTerm, statusFilter, dateFilter, dentistFilter, selectedDate, bookings])

  const bookingsByDentist = useMemo(() => {
    if (viewMode !== 'split') return {}
    
    const grouped: Record<string, Booking[]> = {}
    DENTISTS.forEach((dentist) => {
      grouped[dentist.name] = filteredBookings.filter((b) => b.dentist === dentist.name)
    })
    return grouped
  }, [filteredBookings, viewMode])

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Service', 'Dentist', 'Date', 'Time', 'Status', 'Deposit', 'Total']
    const rows = filteredBookings.map((b) => [
      b.id,
      b.patient,
      b.service,
      b.dentist,
      b.date,
      b.time,
      b.status,
      `R${b.deposit}`,
      `R${b.total}`,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
                All Bookings
              </h1>
              <p className="text-gray-600">View and manage all appointments</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Booking</span>
              </button>
              <button onClick={exportToCSV} className="btn-secondary flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'split'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Split by Dentist"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  {viewMode === 'split' ? 'Split by Dentist' : 'List View'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 input-field"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <select
                  value={dentistFilter}
                  onChange={(e) => setDentistFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Dentists</option>
                  {DENTISTS.map((dentist) => (
                    <option key={dentist.id} value={dentist.name}>
                      {dentist.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedDate(new Date(e.target.value))
                      setDateFilter('all')
                    } else {
                      setSelectedDate(null)
                    }
                  }}
                  className="input-field"
                />
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate(null)
                      setDateFilter('all')
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {!selectedDate && (
              <div className="flex items-center space-x-4">
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value)
                    setSelectedDate(null)
                  }}
                  className="input-field"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 overflow-x-auto"
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Dentist</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Deposit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <td className="py-4 px-4 text-sm text-gray-800 font-mono">{booking.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-800">{booking.patient}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{booking.service}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{booking.dentist}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>R{booking.deposit}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                      R{booking.total}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewBooking(booking)
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Split View by Dentist */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {DENTISTS.map((dentist, dentistIndex) => {
              const dentistBookings = bookingsByDentist[dentist.name] || []
              return (
                <motion.div
                  key={dentist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + dentistIndex * 0.1 }}
                  className="card p-6"
                >
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="text-xl font-display font-bold text-gray-800 mb-1">
                      {dentist.name}
                    </h3>
                    <p className="text-sm text-gray-600">{dentist.specialization}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {dentistBookings.length} {dentistBookings.length === 1 ? 'booking' : 'bookings'}
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {dentistBookings.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No bookings</p>
                    ) : (
                      dentistBookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.03 }}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                          onClick={() => handleViewBooking(booking)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                {booking.patient}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">{booking.service}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{format(new Date(booking.date), 'MMM d')}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{booking.time}</span>
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewBooking(booking)
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                            <span className="text-xs font-semibold text-gray-800">R{booking.total}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
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
        booking={selectedBooking}
      />
    </div>
  )
}

export default Bookings

