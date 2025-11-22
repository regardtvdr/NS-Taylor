import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Search, Filter, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Appointment } from '../types'
import { formatDate } from '../utils/dateUtils'

const StaffDashboard = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date()) // Reserved for future date filtering
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: 'APT-001',
      service: 'Comprehensive Consultation',
      date: '2024-02-15',
      time: '09:00',
      patient: 'Sarah Mitchell',
      status: 'confirmed',
      deposit: 50,
    },
    {
      id: 'APT-002',
      service: 'Teeth Cleaning & Polish',
      date: '2024-02-15',
      time: '10:30',
      patient: 'James Thompson',
      status: 'confirmed',
      deposit: 50,
    },
    {
      id: 'APT-003',
      service: 'Teeth Whitening',
      date: '2024-02-15',
      time: '14:00',
      patient: 'Emma Wilson',
      status: 'pending',
      deposit: 50,
    },
    {
      id: 'APT-004',
      service: 'Root Canal Treatment',
      date: '2024-02-16',
      time: '11:00',
      patient: 'Michael Brown',
      status: 'confirmed',
      deposit: 50,
    },
    {
      id: 'APT-005',
      service: 'Emergency Visit',
      date: '2024-02-16',
      time: '15:30',
      patient: 'Lisa Anderson',
      status: 'cancelled',
      deposit: 50,
    },
  ]

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
            Staff Dashboard
          </h1>
          <p className="text-gray-600">Manage appointments and view analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Appointments', value: stats.total, icon: Calendar, color: 'gray' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'green' },
            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'orange' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red' },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="flex-1 input-field"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.service}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date(appointment.date))}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{appointment.patient}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`px-4 py-2 rounded-button border-2 flex items-center space-x-2 ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span className="font-medium capitalize">{appointment.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Deposit</div>
                    <div className="font-semibold text-gray-800">R{appointment.deposit}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffDashboard

