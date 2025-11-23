import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle, Clock, User, Plus, UserPlus, LayoutGrid, List, AlertCircle, Move, Mail, Search, X } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { useToast } from '../../contexts/ToastContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import CreateBookingModal from '../../components/staff/CreateBookingModal'
import BookingDetailModal from '../../components/staff/BookingDetailModal'
import PatientSearch from '../../components/staff/PatientSearch'
import { DENTISTS } from '../../utils/constants'
import { Patient } from '../../types'
import { useBookings } from '../../hooks/useBookings'
import { usePatients } from '../../hooks/usePatients'

type TodayAppointment = {
  id: string
  time: string
  patient: string
  service: string
  dentist: string
  status: 'scheduled' | 'arrived' | 'no-show'
  phone?: string
  email?: string
  date?: string
}

const Today = () => {
  const { bookings, createBooking, updateBooking, updateBookingStatus } = useBookings()
  const { patients, createPatient } = usePatients()
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Convert bookings to appointments format for today
  const appointments = useMemo(() => {
    return bookings
      .filter(b => b.date === today && (b.status === 'confirmed' || b.status === 'pending' || b.status === 'arrived' || b.status === 'no-show'))
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
  }, [bookings, today])

  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedPatient, setDraggedPatient] = useState<Patient | null>(null)
  const [pointerDragState, setPointerDragState] = useState<{
    appointmentId: string | null
    startX: number
    startY: number
  } | null>(null)
  const [previewSlot, setPreviewSlot] = useState<{ time: string; dentist: string; appointment: TodayAppointment | null } | null>(null)
  const draggedElementRef = useRef<HTMLElement | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragStartPositionRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'hourly'>('timeline')
  const [selectedEmergencyPatient, setSelectedEmergencyPatient] = useState<Patient | null>(null)
  const [pendingEmergencyBooking, setPendingEmergencyBooking] = useState<{ id: string; patient: string; time: string; dentist: string } | null>(null)
  const [pendingTimeChange, setPendingTimeChange] = useState<{ appointmentId: string; patient: string; oldTime: string; oldDentist: string; newTime: string; newDentist: string } | null>(null)
  const [timeChangeMode, setTimeChangeMode] = useState(false)
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<TodayAppointment | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dentistDates, setDentistDates] = useState<Record<string, Date>>(() => {
    const today = new Date()
    const dates: Record<string, Date> = {}
    DENTISTS.forEach((dentist) => {
      dates[dentist.name] = today
    })
    return dates
  })
  const { showToast } = useToast()

  const allPatients = patients

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

  const handleAction = async (id: string, action: 'call' | 'whatsapp' | 'arrived' | 'no-show') => {
    if (action === 'arrived') {
      try {
        await updateBookingStatus(id, 'arrived')
        showToast('Patient marked as arrived! 🎉', 'success')
      } catch (error) {
        console.error('Failed to update booking status:', error)
      }
    } else if (action === 'no-show') {
      try {
        await updateBookingStatus(id, 'no-show')
        showToast('Marked as no-show', 'warning')
      } catch (error) {
        console.error('Failed to update booking status:', error)
      }
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

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggedPatient(null)
  }

  // Pointer-based drag handlers (allows scrolling during drag)
  const handlePointerDown = (e: React.PointerEvent, appointmentId: string) => {
    if (!timeChangeMode) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    
    const element = e.currentTarget as HTMLElement
    const rect = element.getBoundingClientRect()
    const timelineContainer = document.getElementById('timeline-container')
    const initialScrollTop = timelineContainer?.scrollTop || 0
    
    const startX = e.clientX
    const startY = e.clientY
    
    // Calculate the offset from the cursor to the element's center
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    
    draggedElementRef.current = element
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    dragStartPositionRef.current = {
      x: startX,
      y: startY,
      scrollTop: initialScrollTop,
    }
    
    setPointerDragState({
      appointmentId,
      startX,
      startY,
    })
    setDraggedItem(appointmentId)
    
    // Store initial rect for width calculation
    const initialRect = rect
    const initialOffsetX = dragOffsetRef.current.x
    const initialOffsetY = dragOffsetRef.current.y
    
    // Add global pointer move handler for smooth dragging
    const handleGlobalPointerMove = (moveEvent: PointerEvent) => {
      if (!draggedElementRef.current) return
      
      // Use fixed positioning relative to viewport - this keeps element under cursor during scroll
      // Position element so cursor is at the same offset from center as when drag started
      const left = moveEvent.clientX - initialOffsetX - initialRect.width / 2
      const top = moveEvent.clientY - initialOffsetY - initialRect.height / 2
      
      // Update position directly via CSS for smooth performance
      requestAnimationFrame(() => {
        if (draggedElementRef.current) {
          draggedElementRef.current.style.position = 'fixed'
          draggedElementRef.current.style.left = `${left}px`
          draggedElementRef.current.style.top = `${top}px`
          draggedElementRef.current.style.width = `${initialRect.width}px`
          draggedElementRef.current.style.zIndex = '1000'
          draggedElementRef.current.style.transform = 'none'
          draggedElementRef.current.style.pointerEvents = 'none'
        }
      })
      
      // Find which slot the cursor is over for preview
      const timelineContainerEl = document.getElementById('timeline-container')
      if (timelineContainerEl) {
        const containerRect = timelineContainerEl.getBoundingClientRect()
        const y = moveEvent.clientY - containerRect.top + timelineContainerEl.scrollTop
        
        // Find the slot element at this position
        const slotElements = timelineContainerEl.querySelectorAll('[data-slot-time]')
        let foundSlot: { time: string; dentist: string } | null = null
        
        for (const slotEl of slotElements) {
          const slotRect = slotEl.getBoundingClientRect()
          const slotTop = slotRect.top - containerRect.top + timelineContainerEl.scrollTop
          const slotBottom = slotTop + slotRect.height
          
          if (y >= slotTop && y <= slotBottom) {
            const timeSlot = slotEl.getAttribute('data-slot-time')
            const dentist = slotEl.getAttribute('data-slot-dentist')
            if (timeSlot && dentist) {
              foundSlot = { time: timeSlot, dentist }
              break
            }
          }
        }
        
        // Update preview slot
        if (foundSlot) {
          const appointment = appointments.find(a => a.id === appointmentId)
          setPreviewSlot({ 
            time: foundSlot.time, 
            dentist: foundSlot.dentist,
            appointment: appointment || null
          })
        } else {
          setPreviewSlot(null)
        }
      }
    }
    
    // Handle scroll - with fixed positioning, element should stay under cursor automatically
    // But we can use this to ensure smooth updates
    const handleScroll = () => {
      // Fixed positioning handles scroll automatically, no action needed
      // The element will stay at the same viewport position
    }
    
    // Add scroll listener to timeline container
    const timelineContainerEl = document.getElementById('timeline-container')
    if (timelineContainerEl) {
      timelineContainerEl.addEventListener('scroll', handleScroll, { passive: true })
    }
    
    const handleGlobalPointerUp = (upEvent: PointerEvent) => {
      document.removeEventListener('pointermove', handleGlobalPointerMove)
      document.removeEventListener('pointerup', handleGlobalPointerUp)
      
      if (timelineContainerEl) {
        timelineContainerEl.removeEventListener('scroll', handleScroll)
      }
      
      if (draggedElementRef.current) {
        // Reset all styles
        draggedElementRef.current.style.position = ''
        draggedElementRef.current.style.left = ''
        draggedElementRef.current.style.top = ''
        draggedElementRef.current.style.width = ''
        draggedElementRef.current.style.transform = ''
        draggedElementRef.current.style.zIndex = ''
        draggedElementRef.current.style.pointerEvents = ''
      }
      
      // Find which time slot the pointer is over
      if (timelineContainerEl) {
        const rect = timelineContainerEl.getBoundingClientRect()
        const y = upEvent.clientY - rect.top + timelineContainerEl.scrollTop
        
        // Find the slot element at this position
        const slotElements = timelineContainerEl.querySelectorAll('[data-slot-time]')
        for (const slotEl of slotElements) {
          const slotRect = slotEl.getBoundingClientRect()
          const slotTop = slotRect.top - rect.top + timelineContainerEl.scrollTop
          const slotBottom = slotTop + slotRect.height
          
          if (y >= slotTop && y <= slotBottom) {
            const timeSlot = slotEl.getAttribute('data-slot-time')
            const dentist = slotEl.getAttribute('data-slot-dentist')
            if (timeSlot && dentist && appointmentId) {
              handleAppointmentTimeDrop(appointmentId, timeSlot, dentist)
            }
            break
          }
        }
      }
      
      setPointerDragState(null)
      setDraggedItem(null)
      draggedElementRef.current = null
    }
    
    document.addEventListener('pointermove', handleGlobalPointerMove)
    document.addEventListener('pointerup', handleGlobalPointerUp)
  }

  const handlePointerMove = (_e: React.PointerEvent) => {
    // This is now handled globally in handlePointerDown
    // Keeping for compatibility but it won't be called during drag
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDragState || !timeChangeMode) return
    
    e.preventDefault()
    e.currentTarget.releasePointerCapture(e.pointerId)
    
    // Find which time slot the pointer is over
    const timelineContainer = document.getElementById('timeline-container')
    if (timelineContainer) {
      const rect = timelineContainer.getBoundingClientRect()
      const y = e.clientY - rect.top + timelineContainer.scrollTop
      
      // Find the slot element at this position
      const slotElements = timelineContainer.querySelectorAll('[data-slot-time]')
      for (const slotEl of slotElements) {
        const slotRect = slotEl.getBoundingClientRect()
        const slotTop = slotRect.top - rect.top + timelineContainer.scrollTop
        const slotBottom = slotTop + slotRect.height
        
        if (y >= slotTop && y <= slotBottom) {
          const timeSlot = slotEl.getAttribute('data-slot-time')
          const dentist = slotEl.getAttribute('data-slot-dentist')
          if (timeSlot && dentist && pointerDragState.appointmentId) {
            handleAppointmentTimeDrop(pointerDragState.appointmentId, timeSlot, dentist)
          }
          break
        }
      }
    }
    
    setPointerDragState(null)
    setDraggedItem(null)
  }

  const handleAppointmentTimeDrop = (appointmentId: string, newTimeSlot: string, newDentist: string) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    if (!appointment) return

    // Check for conflicts
    const hasConflict = appointments.some(apt => 
      apt.id !== appointmentId &&
      apt.time === newTimeSlot &&
      apt.dentist === newDentist
    )

    if (hasConflict) {
      showToast('Time slot is already occupied. Please choose another slot.', 'error')
      return
    }

    // Store pending change instead of immediately applying
    setPendingTimeChange({
      appointmentId: appointmentId,
      patient: appointment.patient,
      oldTime: appointment.time,
      oldDentist: appointment.dentist,
      newTime: newTimeSlot,
      newDentist: newDentist,
    })
    setDraggedItem(null)
    showToast(`Time change pending for ${appointment.patient}. Please confirm.`, 'info')
  }

  const handleConfirmTimeChange = async () => {
    if (!pendingTimeChange) return

    try {
      await updateBooking(pendingTimeChange.appointmentId, {
        time: pendingTimeChange.newTime,
        dentist: pendingTimeChange.newDentist,
      })
      showToast(`Appointment moved to ${pendingTimeChange.newTime} with ${pendingTimeChange.newDentist}`, 'success')
      setPendingTimeChange(null)
      setPreviewSlot(null)
    } catch (error) {
      console.error('Failed to update booking time:', error)
      showToast('Failed to update appointment time', 'error')
    }
  }

  const handleCancelTimeChange = () => {
    if (!pendingTimeChange) return

    setPendingTimeChange(null)
    setPreviewSlot(null) // Clear preview when cancelled
    showToast('Time change cancelled', 'warning')
  }

  // Enable scrolling while dragging - handle wheel events during drag
  // Note: HTML5 drag API may block wheel events, so we use both document-level and container-level handlers
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only handle scrolling during drag operations
      if (!draggedItem && !draggedPatient && !timeChangeMode) return

      const timelineContainer = document.getElementById('timeline-container')
      if (timelineContainer) {
        // Check if the mouse is over the timeline container
        const rect = timelineContainer.getBoundingClientRect()
        const isOverContainer = e.clientX >= rect.left && e.clientX <= rect.right && 
                                e.clientY >= rect.top && e.clientY <= rect.bottom
        
        if (isOverContainer) {
          // Manually scroll the container with bounds checking
          const currentScroll = timelineContainer.scrollTop
          const maxScroll = timelineContainer.scrollHeight - timelineContainer.clientHeight
          const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + e.deltaY))
          timelineContainer.scrollTop = newScroll
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }
    }

    // Use capture phase and non-passive to ensure we can prevent default
    // This must be on document to catch events before they're blocked
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [draggedItem, draggedPatient, timeChangeMode])


  const handlePatientDragStart = (patient: Patient) => {
    setDraggedPatient(patient)
  }

  const handlePatientDrop = (timeSlot: string, dentist: string) => {
    if (!draggedPatient) return

    // Create emergency booking preview (will be saved on confirm)
    const bookingId = `EMERG-${Date.now()}`
    setPendingEmergencyBooking({
      id: bookingId,
      patient: `${draggedPatient.firstName} ${draggedPatient.lastName}`,
      time: timeSlot,
      dentist: dentist,
    })
    setDraggedPatient(null)
    showToast(`Emergency booking created for ${draggedPatient.firstName} ${draggedPatient.lastName}. Please confirm.`, 'info')
  }

  const handleConfirmEmergencyBooking = async () => {
    if (!pendingEmergencyBooking || !draggedPatient) return
    
    try {
      await createBooking({
        patient: pendingEmergencyBooking.patient,
        email: draggedPatient.email,
        phone: draggedPatient.phone,
        service: 'Emergency Visit',
        dentist: pendingEmergencyBooking.dentist,
        date: today,
        time: pendingEmergencyBooking.time,
        status: 'confirmed',
      })
      setPendingEmergencyBooking(null)
      setSelectedEmergencyPatient(null)
      setPreviewSlot(null)
      showToast('Emergency booking confirmed!', 'success')
    } catch (error) {
      console.error('Failed to create emergency booking:', error)
      showToast('Failed to create emergency booking', 'error')
    }
  }

  const handleCancelEmergencyBooking = () => {
    if (!pendingEmergencyBooking) return

    setPendingEmergencyBooking(null)
    setPreviewSlot(null)
    showToast('Emergency booking cancelled', 'warning')
  }

  const handleEmergencyPatientSelect = (patient: Patient) => {
    setSelectedEmergencyPatient(patient)
  }

  const handleAddNewPatient = async (patientData: { firstName: string; lastName: string; email: string; phone: string }) => {
    try {
      const patientId = await createPatient({
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
      })
      
      // Find the newly created patient (will be in patients after reload)
      const newPatient: Patient = {
        id: patientId,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        createdAt: new Date().toISOString().split('T')[0],
        totalVisits: 0,
        totalSpent: 0,
      }
      
      // Automatically select the new patient
      setSelectedEmergencyPatient(newPatient)
      
      setIsAddPatientModalOpen(false)
      showToast(`Patient ${patientData.firstName} ${patientData.lastName} added and selected!`, 'success')
    } catch (error) {
      console.error('Failed to create patient:', error)
      showToast('Failed to create patient', 'error')
    }
  }

  const handleCreateBooking = async (newBooking: any) => {
    try {
      await createBooking({
        patient: newBooking.patient,
        email: newBooking.email,
        phone: newBooking.phone,
        service: newBooking.service,
        dentist: newBooking.dentist,
        date: newBooking.date || today,
        time: newBooking.time,
        status: 'confirmed',
        deposit: newBooking.deposit,
        total: newBooking.total,
      })
      showToast('Walk-in appointment added!', 'success')
    } catch (error) {
      console.error('Failed to create booking:', error)
      showToast('Failed to create appointment', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700'
      case 'no-show':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600'
    }
  }

  // Generate time slots (8 AM to 5 PM, 15-min intervals)
  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:15`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:45`)
      }
    }
    return slots
  }, [])

  // Filter appointments by selected dates for each dentist
  const filteredAppointmentsForTimeline = useMemo(() => {
    return appointments.filter((apt) => {
      const selectedDate = dentistDates[apt.dentist]
      if (!selectedDate) return false
      const aptDate = apt.date ? new Date(apt.date) : new Date()
      return isSameDay(aptDate, selectedDate)
    })
  }, [appointments, dentistDates])

  // Group appointments by time slot and dentist for timeline view (15-minute intervals)
  const appointmentsByTimeSlotAndDentist = useMemo(() => {
    const grouped: Record<string, Record<string, TodayAppointment[]>> = {}
    
    // Initialize all time slots for all dentists
    timeSlots.forEach((time) => {
      grouped[time] = {}
      DENTISTS.forEach((dentist) => {
        grouped[time][dentist.name] = []
      })
    })

    // Populate with filtered appointments
    filteredAppointmentsForTimeline.forEach((apt) => {
      if (grouped[apt.time] && grouped[apt.time][apt.dentist]) {
        grouped[apt.time][apt.dentist].push(apt)
      }
    })

    return grouped
  }, [filteredAppointmentsForTimeline, timeSlots])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 pb-24 md:pb-8 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
              Today's Schedule
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage today's appointments • {format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => {
                  setViewMode('timeline')
                  // playSound('click')
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('hourly')
                  // playSound('click')
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'hourly'
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
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
                // playSound('click')
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
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Timeline View */}
              {viewMode === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card p-6 bg-white dark:bg-gray-800"
                >
                  {/* Date Selectors for Each Dentist */}
                  <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {DENTISTS.map((dentist) => (
                      <div key={dentist.id} className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                          {dentist.name}:
                        </label>
                        <input
                          type="date"
                          value={format(dentistDates[dentist.name] || new Date(), 'yyyy-MM-dd')}
                          onChange={(e) => {
                            const newDate = new Date(e.target.value)
                            setDentistDates((prev) => ({
                              ...prev,
                              [dentist.name]: newDate,
                            }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                        />
                      </div>
                    ))}
                  </div>

                  <div 
                    className="flex overflow-x-hidden overflow-y-scroll max-h-[calc(100vh-300px)]" 
                    id="timeline-container" 
                    style={{ scrollBehavior: 'smooth' }}
                    onWheel={(e) => {
                      // Only intercept scrolling when actively dragging an item
                      // This allows normal native scrolling when time change mode is on but not dragging
                      if (draggedItem || draggedPatient) {
                        const container = e.currentTarget
                        const currentScroll = container.scrollTop
                        const maxScroll = container.scrollHeight - container.clientHeight
                        // Use much faster scroll speed (6x deltaY for quick scrolling up and down)
                        const scrollAmount = e.deltaY * 6
                        const newScroll = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount))
                        container.scrollTop = newScroll
                        e.preventDefault()
                        e.stopPropagation()
                        return false
                      }
                      // If not dragging, let native scroll work normally
                    }}
                  >
                    {/* Timeline */}
                    <div className="w-24 flex-shrink-0">
                      {/* Header spacer to match dentist column headers */}
                      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 mb-2" style={{ marginTop: '-0.2' }}>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                          Time
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          &nbsp;
                        </p>
                      </div>
                      {timeSlots.map((slot) => {
                        const [hour, minute] = slot.split(':')
                        const isQuarterHour = minute === '15' || minute === '45'
                        const isHalfHour = minute === '30'
                        const isHourly = minute === '00'
                        return (
                          <div 
                            key={slot} 
                            className={`border-b border-gray-200 dark:border-gray-700 flex items-start pt-1 h-16 ${isHourly ? 'border-t-2 border-gray-400 dark:border-gray-500' : ''}`}
                          >
                            {minute === '00' && (
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{hour}:00</span>
                            )}
                            {isHalfHour && (
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{hour}:30</span>
                            )}
                            {isQuarterHour && !isHalfHour && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">{minute}</span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Dentist Columns */}
                    <div className="flex-1 flex gap-4 min-w-0">
                      {DENTISTS.map((dentist, index) => (
                        <div 
                          key={dentist.id} 
                          className={`flex-1 min-w-[200px] relative ${index < DENTISTS.length - 1 ? 'pr-4' : ''}`}
                        >
                          {/* Vertical divider line that extends full height - positioned to match all time slots */}
                          {index < DENTISTS.length - 1 && (
                            <div 
                              className="absolute right-0 w-0.5 bg-gray-300 dark:bg-gray-600 z-0"
                              style={{ 
                                top: 0, 
                                bottom: 0,
                                height: `${timeSlots.length * 64}px` // 64px per slot (h-16 = 4rem = 64px)
                              }}
                            />
                          )}
                          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 mb-2">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                              {dentist.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(dentistDates[dentist.name] || new Date(), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {timeSlots.map((slot) => {
                            const slotAppointments = appointmentsByTimeSlotAndDentist[slot]?.[dentist.name] || []
                            const [, minute] = slot.split(':')
                            const isHourly = minute === '00'
                            return (
                              <div
                                key={slot}
                                data-slot-time={slot}
                                data-slot-dentist={dentist.name}
                                className={`border-b border-gray-200 dark:border-gray-700 relative h-16 ${isHourly ? 'border-t-2 border-gray-400 dark:border-gray-500' : ''} ${pointerDragState && pointerDragState.appointmentId ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                                onDragOver={(e) => {
                                  e.preventDefault()
                                  if (!timeChangeMode) {
                                    e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900')
                                  }
                                }}
                                onDragLeave={(e) => {
                                  if (!timeChangeMode) {
                                    e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900')
                                  }
                                }}
                                onDrop={(e) => {
                                  e.preventDefault()
                                  e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900')
                                  if (!timeChangeMode && draggedItem) {
                                    handleAppointmentTimeDrop(draggedItem, slot, dentist.name)
                                  } else if (draggedPatient) {
                                    handlePatientDrop(slot, dentist.name)
                                  }
                                }}
                              >
                                <div className="flex flex-col space-y-1 pt-1">
                                  {/* Preview slot when dragging */}
                                  {previewSlot && previewSlot.time === slot && previewSlot.dentist === dentist.name && previewSlot.appointment && (
                                    <motion.div
                                      initial={{ opacity: 0.3 }}
                                      animate={{ opacity: 0.5 }}
                                      className="flex items-center space-x-2 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 opacity-50"
                                    >
                                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-600 dark:text-gray-400 truncate text-sm leading-tight">{previewSlot.appointment.patient}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 truncate leading-tight">{previewSlot.appointment.service}</p>
                                      </div>
                                    </motion.div>
                                  )}
                                  {slotAppointments.map((apt) => {
                                    const matchesSearch = searchQuery && apt.patient.toLowerCase().includes(searchQuery.toLowerCase())
                                    return (
                                      <motion.div
                                      key={apt.id}
                                      draggable={!timeChangeMode}
                                      onDragStart={() => !timeChangeMode && handleDragStart(apt.id)}
                                      onDragEnd={handleDragEnd}
                                      onPointerDown={(e) => timeChangeMode && handlePointerDown(e, apt.id)}
                                      onPointerMove={handlePointerMove}
                                      onPointerUp={handlePointerUp}
                                      onClick={(e) => {
                                        if (!timeChangeMode && !pointerDragState) {
                                          e.stopPropagation()
                                          setSelectedAppointment(apt)
                                          setIsDetailModalOpen(true)
                                        }
                                      }}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ 
                                        opacity: 1, 
                                        x: 0,
                                        y: 0,
                                        scale: matchesSearch ? [1, 1.05, 1] : 1,
                                      }}
                                      transition={matchesSearch ? {
                                        scale: {
                                          duration: 1.5,
                                          repeat: Infinity,
                                          repeatType: "reverse",
                                          ease: "easeInOut"
                                        }
                                      } : {}}
                                      style={{
                                        position: 'static',
                                        zIndex: matchesSearch ? 10 : 1,
                                        transform: '', // Will be set directly via DOM in handlePointerDown
                                      }}
                                      className={`flex items-center space-x-2 p-2 rounded border hover:shadow-md group ${
                                        matchesSearch
                                          ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600 hover:border-teal-500 dark:hover:border-teal-500 shadow-lg'
                                          : timeChangeMode
                                          ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-move touch-none'
                                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer'
                                      }`}
                                    >
                                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm leading-tight">{apt.patient}</h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate leading-tight">{apt.service}</p>
                                      </div>
                                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                          {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                                        </span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" onClick={(e) => e.stopPropagation()}>
                                          {apt.phone && (
                                            <>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleAction(apt.id, 'call')
                                                }}
                                                className="p-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors relative z-10"
                                                title="Call"
                                              >
                                                <Phone className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                                              </motion.button>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleAction(apt.id, 'whatsapp')
                                                }}
                                                className="p-1.5 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors relative z-10"
                                                title="WhatsApp"
                                              >
                                                <MessageCircle className="w-3.5 h-3.5 text-green-700 dark:text-green-300" />
                                              </motion.button>
                                            </>
                                          )}
                                          {apt.status !== 'arrived' && (
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleAction(apt.id, 'arrived')
                                              }}
                                              className="p-1.5 bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 rounded transition-colors relative z-10"
                                              title="Mark Arrived"
                                            >
                                              <CheckCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />
                                            </motion.button>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

          {/* Hourly Breakdown by Dentist View */}
          {viewMode === 'hourly' && (
            <motion.div
              key="hourly"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-6 bg-white dark:bg-gray-800"
            >
              <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100 mb-6">Hourly Breakdown by Dentist</h2>
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const timeAppointments = appointmentsByTimeAndDentist[time] || {}

                  return (
                    <div key={time} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{time}</span>
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
                                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault()
                                if (isEmpty) {
                                  e.currentTarget.classList.add('bg-blue-50', 'dark:bg-blue-900', 'border-blue-300', 'dark:border-blue-600')
                                }
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'border-blue-300', 'dark:border-blue-600')
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                e.currentTarget.classList.remove('bg-blue-50', 'dark:bg-blue-900', 'border-blue-300', 'dark:border-blue-600')
                                if (timeChangeMode && draggedItem && isEmpty) {
                                  // Move existing appointment to this time slot
                                  handleAppointmentTimeDrop(draggedItem, time, dentist.name)
                                } else if (draggedPatient && isEmpty) {
                                  handlePatientDrop(time, dentist.name)
                                }
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{dentist.name}</h3>
                                {!isEmpty && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                    {dentistAppointments.length} {dentistAppointments.length === 1 ? 'appointment' : 'appointments'}
                                  </span>
                                )}
                              </div>

                              {isEmpty ? (
                                <div className="text-center py-4">
                                  <div className="text-gray-400 dark:text-gray-500 text-sm">Available</div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {dentistAppointments.map((apt) => {
                                    const matchesSearch = searchQuery && apt.patient.toLowerCase().includes(searchQuery.toLowerCase())
                                    return (
                                      <motion.div
                                        key={apt.id}
                                        draggable={timeChangeMode || true}
                                        onDragStart={() => handleDragStart(apt.id)}
                                        onClick={(e) => {
                                          if (!timeChangeMode) {
                                            e.stopPropagation()
                                            setSelectedAppointment(apt)
                                            setIsDetailModalOpen(true)
                                          }
                                        }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ 
                                          opacity: 1, 
                                          y: 0,
                                          scale: matchesSearch ? [1, 1.05, 1] : 1,
                                        }}
                                        transition={matchesSearch ? {
                                          scale: {
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                          }
                                        } : {}}
                                        className={`p-3 rounded-lg border transition-colors group ${
                                          matchesSearch
                                            ? 'bg-teal-100 dark:bg-teal-900/50 border-teal-400 dark:border-teal-600 hover:border-teal-500 dark:hover:border-teal-500 shadow-lg'
                                            : timeChangeMode
                                            ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-move'
                                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer'
                                        }`}
                                      >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{apt.patient}</h4>
                                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{apt.service}</p>
                                          <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                                              {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                                          {apt.phone && (
                                            <>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleAction(apt.id, 'call')
                                                }}
                                                className="p-1.5 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded transition-colors relative z-10"
                                                title="Call"
                                              >
                                                <Phone className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                                              </motion.button>
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleAction(apt.id, 'whatsapp')
                                                }}
                                                className="p-1.5 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded transition-colors relative z-10"
                                                title="WhatsApp"
                                              >
                                                <MessageCircle className="w-3 h-3 text-green-700 dark:text-green-300" />
                                              </motion.button>
                                            </>
                                          )}
                                          {apt.status !== 'arrived' && (
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleAction(apt.id, 'arrived')
                                              }}
                                              className="p-1.5 bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 rounded transition-colors relative z-10"
                                              title="Mark Arrived"
                                            >
                                              <CheckCircle className="w-3 h-3 text-teal-700 dark:text-teal-300" />
                                            </motion.button>
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                    )
                                  })}
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

            {/* Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
              {/* Search Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-600"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">
                    Search Appointments
                  </h2>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Search for appointments by patient name to quickly find them in the schedule.
                </p>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by patient name..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent"
                  />
                </div>

                {searchQuery && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {appointments.filter(apt => 
                        apt.patient.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length} appointment(s) found
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-hide">
                      {appointments
                        .filter(apt => 
                          apt.patient.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((apt, index) => (
                          <motion.button
                            key={apt.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                              opacity: 1, 
                              scale: [1, 1.02, 1],
                            }}
                            transition={{
                              opacity: { duration: 0.3, delay: index * 0.05 },
                              scale: {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                              }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setIsDetailModalOpen(true)
                              // Scroll to the appointment in the timeline
                              const slotElement = document.querySelector(`[data-slot-time="${apt.time}"][data-slot-dentist="${apt.dentist}"]`)
                              if (slotElement) {
                                slotElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }}
                            className="w-full text-left p-3 rounded-lg bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 border-2 border-teal-300 dark:border-teal-700 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                                  {apt.patient}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {apt.time} • {apt.dentist}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                  {apt.service}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ml-2 flex-shrink-0 ${getStatusColor(apt.status)}`}>
                                {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Time Change Mode Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-600"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Move className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">
                    Time Changes
                  </h2>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enable time change mode to drag and move existing appointments to different time slots. This is useful for rescheduling or adjusting appointment times.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTimeChangeMode(!timeChangeMode)
                    setDraggedItem(null)
                    showToast(
                      timeChangeMode 
                        ? 'Time change mode disabled' 
                        : 'Time change mode enabled - drag appointments to move them',
                      'info'
                    )
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    timeChangeMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700 shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Move className={`w-4 h-4 ${timeChangeMode ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>{timeChangeMode ? 'Time Change Mode: ON' : 'Enable Time Changes'}</span>
                </motion.button>

                {timeChangeMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-2">
                          How to Use:
                        </h3>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                          <li>Drag any appointment card to a different time slot</li>
                          <li>The system will automatically find an available dentist</li>
                          <li>Conflicts will be prevented automatically</li>
                          <li>Confirm the change in the pending section below</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!timeChangeMode && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Click the button above to enable time change mode
                    </p>
                  </div>
                )}

                {/* Time Change Confirmation */}
                {pendingTimeChange && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 dark:bg-amber-900 border-2 border-amber-500 dark:border-amber-600 rounded-lg p-4 mt-4"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          Pending Time Change
                        </h3>
                        <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                          <p><span className="font-medium">Patient:</span> {pendingTimeChange.patient}</p>
                          <p><span className="font-medium">From:</span> {pendingTimeChange.oldTime} with {pendingTimeChange.oldDentist}</p>
                          <p><span className="font-medium">To:</span> {pendingTimeChange.newTime} with {pendingTimeChange.newDentist}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmTimeChange}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Change</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelTimeChange}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Emergency Bookings Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6 bg-white dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-600"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <h2 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">
                    Emergency Bookings
                  </h2>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Search for a patient and drag them into a time slot to create an emergency booking.
                </p>

                <div className="mb-4">
                  <PatientSearch
                    patients={allPatients}
                    onSelect={handleEmergencyPatientSelect}
                    placeholder="Search patient for emergency booking..."
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Patient</span>
                  </motion.button>
                </div>

                {selectedEmergencyPatient && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 border-2 border-gray-800 dark:border-gray-600"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {selectedEmergencyPatient.firstName} {selectedEmergencyPatient.lastName}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedEmergencyPatient.phone}
                        </p>
                      </div>
                    </div>
                    <div
                      draggable
                      onDragStart={() => handlePatientDragStart(selectedEmergencyPatient)}
                      className="bg-red-50 dark:bg-red-900 border-2 border-red-500 dark:border-red-600 rounded-lg p-3 cursor-move hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          Drag to time slot for emergency booking
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!selectedEmergencyPatient && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Search and select a patient to create an emergency booking
                    </p>
                  </div>
                )}

                {/* Emergency Booking Confirmation */}
                {pendingEmergencyBooking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 dark:bg-amber-900 border-2 border-amber-500 dark:border-amber-600 rounded-lg p-4 mt-4"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                          Pending Emergency Booking
                        </h3>
                        <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                          <p><span className="font-medium">Patient:</span> {pendingEmergencyBooking.patient}</p>
                          <p><span className="font-medium">Time:</span> {pendingEmergencyBooking.time}</p>
                          <p><span className="font-medium">Dentist:</span> {pendingEmergencyBooking.dentist}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmEmergencyBooking}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Booking</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelEmergencyBooking}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {appointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSelectedAppointment(apt)
                setIsDetailModalOpen(true)
              }}
              className="card p-4 bg-white dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center min-w-[60px]">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400 mb-1" />
                  <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{apt.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{apt.patient}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{apt.service}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{apt.dentist}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                      {apt.status === 'arrived' ? 'Arrived' : apt.status === 'no-show' ? 'No-Show' : 'Scheduled'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                  {apt.phone && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAction(apt.id, 'call')
                        }}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg relative z-10"
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAction(apt.id, 'whatsapp')
                        }}
                        className="p-2 bg-green-100 dark:bg-green-900 rounded-lg relative z-10"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-green-700 dark:text-green-300" />
                      </motion.button>
                    </>
                  )}
                  {apt.status !== 'arrived' && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction(apt.id, 'arrived')
                      }}
                      className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg relative z-10"
                      title="Mark Arrived"
                    >
                      <CheckCircle className="w-4 h-4 text-teal-700 dark:text-teal-300" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Floating Add Button for Mobile */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsCreateModalOpen(true)
          // playSound('click')
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

      {/* Add New Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border-2 border-gray-800 dark:border-gray-600"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">
                  Add New Patient
                </h2>
                <button
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AddPatientForm
                onSave={handleAddNewPatient}
                onCancel={() => setIsAddPatientModalOpen(false)}
              />
            </div>
          </motion.div>
        </div>
      )}

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedAppointment(null)
        }}
        booking={selectedAppointment ? {
          id: selectedAppointment.id,
          patient: selectedAppointment.patient,
          email: selectedAppointment.email || '',
          phone: selectedAppointment.phone || '',
          service: selectedAppointment.service,
          dentist: selectedAppointment.dentist,
          date: selectedAppointment.date || format(new Date(), 'yyyy-MM-dd'),
          time: selectedAppointment.time,
          status: selectedAppointment.status === 'arrived' ? 'confirmed' : selectedAppointment.status === 'no-show' ? 'cancelled' : 'confirmed',
          deposit: 0,
          total: 0,
        } : null}
      />
    </div>
  )
}

// Add Patient Form Component
interface AddPatientFormProps {
  onSave: (patient: { firstName: string; lastName: string; email: string; phone: string }) => void
  onCancel: () => void
}

const AddPatientForm = ({ onSave, onCancel }: AddPatientFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          First Name *
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="input-field pl-12 w-full"
            placeholder="First name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Last Name *
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="input-field pl-12 w-full"
            placeholder="Last name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field pl-12 w-full"
            placeholder="patient@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input-field pl-12 w-full"
            placeholder="+27 82 123 4567"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors bg-teal-600 hover:bg-teal-700 text-white border-2 border-teal-700"
        >
          Add Patient
        </motion.button>
      </div>
    </form>
  )
}

export default Today
