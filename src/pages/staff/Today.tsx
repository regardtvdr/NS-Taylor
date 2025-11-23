import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle, XCircle, Clock, User, Plus, UserPlus, LayoutGrid, List } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '../../contexts/ToastContext'
import { playSound } from '../../utils/sounds'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import { DENTISTS } from '../../utils/constants'

interface TodayAppointment {
  id: string
  time: string
  patient: string
  patientPhoto?: string
  service: string
  dentist: string
  depositPaid: boolean
  status: 'scheduled' | 'arrived' | 'no-show'
  phone?: string
}

const Today = () => {
  const [appointments, setAppointments] = useState<TodayAppointment[]>([
    {
      id: '1',
      time: '08:00',
      patient: 'Sarah Mitchell',
      service: 'Teeth Cleaning & Polish',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 82 123 4567',
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
    },
    {
      id: '3',
      time: '11:00',
      patient: 'Emma Wilson',
      service: 'Teeth Whitening',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 84 345 6789',
    },
    {
      id: '4',
      time: '13:30',
      patient: 'Michael Brown',
      service: 'Root Canal Treatment',
      dentist: 'Dr. Sarah Johnson',
      depositPaid: false,
      status: 'scheduled',
      phone: '+27 85 456 7890',
    },
    {
      id: '5',
      time: '15:00',
      patient: 'Lisa Anderson',
      service: 'Emergency Visit',
      dentist: 'Dr. Michael Chen',
      depositPaid: true,
      status: 'scheduled',
      phone: '+27 86 567 8901',
    },
    {
      id: '6',
      time: '16:30',
      patient: 'David Lee',
      service: 'Dental Implant Consultation',
      dentist: 'Dr. Emily Williams',
      depositPaid: true,
      status: 'no-show',
      phone: '+27 87 678 9012',
    },
  ])

  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'hourly'>('timeline')
  const { showToast } = useToast()

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'a',
      action: () => {
        const firstScheduled = appointments.find((a) => a.status === 'scheduled')
        if (firstScheduled) handleAction(firstScheduled.id, 'arrived')
      },
      description: 'Mark first scheduled as arrived',
    },
    {
      key: 'n',
      action: () => {
        const firstScheduled = appointments.find((a) => a.status === 'scheduled')
        if (firstScheduled) handleAction(firstScheduled.id, 'no-show')
      },
      description: 'Mark first scheduled as no-show',
    },
    {
      key: 'w',
      action: () => {
        const firstScheduled = appointments.find((a) => a.status === 'scheduled' && a.phone)
        if (firstScheduled) handleAction(firstScheduled.id, 'whatsapp')
      },
      description: 'WhatsApp first scheduled',
    },
  ])

  const handleAction = (id: string, action: 'call' | 'whatsapp' | 'arrived' | 'no-show') => {
    playSound('click')
    
    if (action === 'arrived') {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'arrived' as const } : apt
        )
      )
      playSound('success')
      showToast('Patient marked as arrived! 🎉', 'success')
    } else if (action === 'no-show') {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: 'no-show' as const } : apt
        )
      )
      playSound('error')
      showToast('Marked as no-show', 'warning')
    } else {
      const apt = appointments.find((a) => a.id === id)
      if (action === 'call') {
        showToast(`Calling ${apt?.patient}...`, 'info')
      } else {
        showToast(`Opening WhatsApp for ${apt?.patient}...`, 'info')
      }
    }
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = appointments.findIndex((a) => a.id === draggedItem)
    const targetIndex = appointments.findIndex((a) => a.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newAppointments = [...appointments]
    const [removed] = newAppointments.splice(draggedIndex, 1)
    newAppointments.splice(targetIndex, 0, removed)

    setAppointments(newAppointments)
    setDraggedItem(null)
    playSound('success')
    showToast('Appointment order updated', 'success')
  }

  const handleCreateBooking = (newBooking: any) => {
    const appointment: TodayAppointment = {
      id: newBooking.id,
      patient: newBooking.patient,
      service: newBooking.service,
      time: newBooking.time,
      dentist: newBooking.dentist,
      depositPaid: newBooking.depositPaid || false,
      status: 'scheduled',
      phone: newBooking.phone,
    }
    setAppointments((prev) => [...prev, appointment].sort((a, b) => a.time.localeCompare(b.time)))
    playSound('success')
    showToast('Walk-in appointment added!', 'success')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'no-show':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Group appointments by hour for timeline view
  const timelineHours = Array.from({ length: 11 }, (_, i) => i + 8) // 8 AM to 6 PM
  const appointmentsByHour = appointments.reduce((acc, apt) => {
    const hour = parseInt(apt.time.split(':')[0])
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(apt)
    return acc
  }, {} as Record<number, TodayAppointment[]>)

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

  // Group appointments by time slot and dentist for hourly view
  const appointmentsByTimeAndDentist = useMemo(() => {
    const grouped: Record<string, Record<string, TodayAppointment[]>> = {}
    
    // Initialize all time slots for all dentists
    timeSlots.forEach((time) => {
      grouped[time] = {}
      DENTISTS.forEach((dentist) => {
        grouped[time][dentist.name] = []
      })
    })

    // Populate with actual appointments
    appointments.forEach((apt) => {
      if (grouped[apt.time] && grouped[apt.time][apt.dentist]) {
        grouped[apt.time][apt.dentist].push(apt)
      }
    })

    return grouped
  }, [appointments, timeSlots])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
              Today's Schedule
            </h1>
            <p className="text-gray-600">Manage today's appointments • {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode('timeline')
                  playSound('click')
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'timeline'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('hourly')
                  playSound('click')
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'hourly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Hourly by Dentist</span>
                <span className="sm:hidden">Hourly</span>
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsCreateModalOpen(true)
                playSound('click')
              }}
              className="btn-primary flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Walk-In</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Desktop Views */}
        <div className="hidden md:block">
          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card p-6 bg-white"
            >
            <div className="flex">
              {/* Timeline */}
              <div className="w-24 flex-shrink-0">
                {timelineHours.map((hour) => (
                    <div key={hour} className="h-24 border-b border-gray-200 flex items-start pt-2">
                      <span className="text-sm font-semibold text-gray-700">{hour}:00</span>
                    </div>
                ))}
              </div>

              {/* Appointments */}
              <div className="flex-1 relative">
                {timelineHours.map((hour) => {
                  const hourAppointments = appointmentsByHour[hour] || []
                  return (
                    <div
                      key={hour}
                      className="h-24 border-b border-gray-200 relative"
                      onDragOver={handleDragOver}
                      onDrop={() => {
                        if (hourAppointments[0]) handleDrop(hourAppointments[0].id)
                      }}
                    >
                      <div className="flex flex-col space-y-2 pt-2">
                        {hourAppointments.map((apt) => (
                          <motion.div
                            key={apt.id}
                            draggable
                            onDragStart={() => handleDragStart(apt.id)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md cursor-move group"
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-gray-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{apt.patient}</h3>
                              <p className="text-xs text-gray-600 truncate">{apt.service}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                              </span>
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {apt.phone && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleAction(apt.id, 'call')}
                                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                      title="Call"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-gray-700" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleAction(apt.id, 'whatsapp')}
                                      className="p-1.5 bg-green-100 hover:bg-green-200 rounded transition-colors"
                                      title="WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-green-700" />
                                    </motion.button>
                                  </>
                                )}
                                {apt.status !== 'arrived' && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAction(apt.id, 'arrived')}
                                    className="p-1.5 bg-teal-100 hover:bg-teal-200 rounded transition-colors"
                                    title="Mark Arrived"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 text-teal-700" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
          )}

          {/* Hourly by Dentist View */}
          {viewMode === 'hourly' && (
            <motion.div
              key="hourly"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6 bg-white"
            >
              <h2 className="text-xl font-display font-bold text-gray-800 mb-6">Hourly Breakdown by Dentist</h2>
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const timeAppointments = appointmentsByTimeAndDentist[time] || {}
                  const hasAnyAppointments = Object.values(timeAppointments).some(apts => apts.length > 0)

                  return (
                    <div key={time} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="text-lg font-semibold text-gray-800">{time}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {DENTISTS.map((dentist) => {
                          const dentistAppointments = timeAppointments[dentist.name] || []
                          const isEmpty = dentistAppointments.length === 0

                          return (
                            <div
                              key={dentist.id}
                              className={`p-4 rounded-lg border-2 ${
                                isEmpty
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 text-sm">{dentist.name}</h3>
                                {!isEmpty && (
                                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {dentistAppointments.length} {dentistAppointments.length === 1 ? 'appointment' : 'appointments'}
                                  </span>
                                )}
                              </div>

                              {isEmpty ? (
                                <div className="text-center py-4">
                                  <div className="text-gray-400 text-sm">Available</div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {dentistAppointments.map((apt) => (
                                    <motion.div
                                      key={apt.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{apt.patient}</h4>
                                          <p className="text-xs text-gray-600 mb-2">{apt.service}</p>
                                          <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                              {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                                            </span>
                                            <span className={`text-xs ${apt.depositPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                              {apt.depositPaid ? '✓ Paid' : '⚠ Pending'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                          {apt.phone && (
                                            <>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleAction(apt.id, 'call')}
                                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                                title="Call"
                                              >
                                                <Phone className="w-3 h-3 text-gray-700" />
                                              </motion.button>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleAction(apt.id, 'whatsapp')}
                                                className="p-1.5 bg-green-100 hover:bg-green-200 rounded transition-colors"
                                                title="WhatsApp"
                                              >
                                                <MessageCircle className="w-3 h-3 text-green-700" />
                                              </motion.button>
                                            </>
                                          )}
                                          {apt.status !== 'arrived' && (
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleAction(apt.id, 'arrived')}
                                              className="p-1.5 bg-teal-100 hover:bg-teal-200 rounded transition-colors"
                                              title="Mark Arrived"
                                            >
                                              <CheckCircle className="w-3 h-3 text-teal-700" />
                                            </motion.button>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {appointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4 bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center min-w-[60px]">
                  <Clock className="w-4 h-4 text-gray-600 mb-1" />
                  <span className="text-lg font-bold text-gray-800">{apt.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{apt.patient}</h3>
                  <p className="text-sm text-gray-600 mb-2">{apt.service}</p>
                  <p className="text-xs text-gray-500 mb-3">{apt.dentist}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                      {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                    </span>
                    <span className={`text-xs ${apt.depositPaid ? 'text-green-600' : 'text-orange-600'}`}>
                      {apt.depositPaid ? '✓ Paid' : '⚠ Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {apt.phone && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAction(apt.id, 'call')}
                        className="p-2 bg-gray-100 rounded-lg"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-gray-700" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAction(apt.id, 'whatsapp')}
                        className="p-2 bg-green-100 rounded-lg"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-green-700" />
                      </motion.button>
                    </>
                  )}
                  {apt.status !== 'arrived' && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAction(apt.id, 'arrived')}
                      className="p-2 bg-teal-100 rounded-lg"
                      title="Mark Arrived"
                    >
                      <CheckCircle className="w-4 h-4 text-teal-700" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 card p-4 bg-gray-50 border-gray-200"
        >
          <p className="text-xs text-gray-700 text-center">
            <span className="font-semibold">Keyboard shortcuts:</span> Press <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-gray-700">A</kbd> for Arrived, <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-gray-700">N</kbd> for No-Show, <kbd className="px-2 py-1 bg-white rounded border border-gray-300 text-gray-700">W</kbd> for WhatsApp
          </p>
        </motion.div>
      </div>

      {/* Floating Add Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsCreateModalOpen(true)
          playSound('click')
        }}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center text-white z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateBooking}
      />
    </div>
  )
}

export default Today
