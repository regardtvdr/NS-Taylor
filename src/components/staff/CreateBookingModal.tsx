import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, AlertCircle } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format, isPast, addMonths } from 'date-fns'
import { SERVICES } from '../../utils/constants'
import { Service, Dentist, RecurrencePattern, BookingDetail } from '../../types'
import { generateTimeSlots } from '../../utils/dateUtils'
import RecurrenceSelector from './RecurrenceSelector'
import { useFilteredDentists } from '../../hooks/useFilteredDentists'
import { checkBookingConflict, isPastBooking } from '../../utils/conflictDetection'
import { useToast } from '../../contexts/ToastContext'
import 'react-day-picker/dist/style.css'

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (booking: any) => void
  bookings?: BookingDetail[]
  initialDate?: string
  initialTime?: string
  initialDentist?: string
  initialPatient?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

const CreateBookingModal = ({ isOpen, onClose, onSave, bookings = [], initialDate, initialTime, initialDentist, initialPatient }: CreateBookingModalProps) => {
  const { dentists: DENTISTS } = useFilteredDentists()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [conflictError, setConflictError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patientName: initialPatient ? `${initialPatient.firstName} ${initialPatient.lastName}` : '',
    patientEmail: initialPatient?.email || '',
    patientPhone: initialPatient?.phone || '',
    service: null as Service | null,
    dentist: initialDentist ? DENTISTS.find(d => d.name === initialDentist) || null : null as Dentist | null,
    date: initialDate ? new Date(initialDate) : null as Date | null,
    time: initialTime || '',
    selectedSlots: [] as string[], // Array of consecutive time slots
    slotCount: 1, // Number of slots (1, 2, or 3)
    notes: '',
    recurrence: null as RecurrencePattern | null,
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const timeSlots = formData.date ? generateTimeSlots(formData.date) : []

  // Check if a time slot is booked or would conflict (considering duration)
  const isSlotBooked = useMemo(() => {
    if (!formData.date || !formData.dentist) return () => false
    
    const dateStr = format(formData.date, 'yyyy-MM-dd')
    const relevantBookings = bookings.filter(b => 
      b.date === dateStr && 
      b.dentist === formData.dentist?.name && 
      b.status !== 'cancelled' &&
      b.status !== 'no-show'
    )
    
    // Create a set of all booked time slots (including duration)
    const bookedSlots = new Set<string>()
    relevantBookings.forEach(booking => {
      const startTime = booking.time
      const duration = booking.duration || 15 // Default 15 minutes
      const startMinutes = parseTimeToMinutes(startTime)
      
      // Add all slots that would be occupied by this booking
      for (let i = 0; i < duration; i += 15) {
        const slotMinutes = startMinutes + i
        const slotTime = formatMinutesToTime(slotMinutes)
        bookedSlots.add(slotTime)
      }
    })
    
    return (time: string) => bookedSlots.has(time)
  }, [formData.date, formData.dentist, bookings])

  // Helper functions for time conversion
  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  // Check if selected slots would conflict with existing bookings
  const checkSelectedSlotsConflict = useMemo(() => {
    if (!formData.date || !formData.dentist || formData.selectedSlots.length === 0) {
      return null
    }
    
    const dateStr = format(formData.date, 'yyyy-MM-dd')
    const relevantBookings = bookings
      .filter(b => 
        b.date === dateStr && 
        b.dentist === formData.dentist?.name && 
        b.status !== 'cancelled' &&
        b.status !== 'no-show'
      )
      .map(b => ({
        id: b.id,
        dentist: b.dentist,
        date: b.date,
        time: b.time,
        duration: b.duration || 15,
      }))

    const newBooking = {
      id: '',
      dentist: formData.dentist.name,
      date: dateStr,
      time: formData.time,
      duration: formData.slotCount * 15,
    }

    return checkBookingConflict(newBooking, relevantBookings)
  }, [formData.date, formData.dentist, formData.time, formData.selectedSlots, formData.slotCount, bookings])

  // Get consecutive time slots starting from a selected time
  const getConsecutiveSlots = (startTime: string, count: number, slots: string[]): string[] => {
    const result: string[] = []
    const startIndex = slots.indexOf(startTime)
    
    if (startIndex === -1) return []
    
    for (let i = 0; i < count && startIndex + i < slots.length; i++) {
      result.push(slots[startIndex + i])
    }
    
    return result
  }

  // Update form when initial values change
  useEffect(() => {
    if (isOpen) {
      if (initialPatient) {
        setFormData(prev => ({
          ...prev,
          patientName: `${initialPatient.firstName} ${initialPatient.lastName}`,
          patientEmail: initialPatient.email,
          patientPhone: initialPatient.phone,
        }))
        // Auto-advance to step 2 if patient is pre-filled
        setStep(2)
      }
      if (initialDate) {
        setFormData(prev => ({ ...prev, date: new Date(initialDate) }))
      }
      if (initialTime) {
        const currentTimeSlots = formData.date ? generateTimeSlots(formData.date) : []
        const slots = getConsecutiveSlots(initialTime, 1, currentTimeSlots)
        setFormData(prev => ({ ...prev, time: initialTime, selectedSlots: slots }))
      }
      if (initialDentist) {
        const dentist = DENTISTS.find(d => d.name === initialDentist)
        if (dentist) {
          setFormData(prev => ({ ...prev, dentist }))
        }
      }
    }
  }, [isOpen, initialDate, initialTime, initialDentist, initialPatient, formData.date, DENTISTS])

  const resetForm = () => {
    setFormData({
      patientName: initialPatient ? `${initialPatient.firstName} ${initialPatient.lastName}` : '',
      patientEmail: initialPatient?.email || '',
      patientPhone: initialPatient?.phone || '',
      service: null,
      dentist: initialDentist ? DENTISTS.find(d => d.name === initialDentist) || null : null,
      date: initialDate ? new Date(initialDate) : null,
      time: initialTime || '',
      selectedSlots: [],
      slotCount: 1,
      notes: '',
      recurrence: null,
    })
    setStep(initialPatient ? 2 : 1) // Auto-advance to step 2 if patient is pre-filled
    setIsCalendarOpen(false)
  }

  // Handle time slot selection with multi-slot support
  const handleTimeSlotClick = (time: string) => {
    // Check if any of the slots would be booked
    const slots = getConsecutiveSlots(time, formData.slotCount, timeSlots)
    const hasConflict = slots.some(slot => isSlotBooked(slot))
    
    if (hasConflict) {
      setConflictError('One or more selected time slots are already booked. Please choose a different time.')
      showToast('Selected time slots conflict with existing bookings', 'error')
      return
    }
    
    setConflictError(null)
    setFormData({
      ...formData,
      time: time,
      selectedSlots: slots,
    })
  }

  const handleSave = () => {
    // Validate all required fields
    if (
      !formData.patientName ||
      !formData.patientEmail ||
      !formData.patientPhone ||
      !formData.service ||
      !formData.dentist ||
      !formData.date ||
      !formData.time ||
      formData.selectedSlots.length === 0
    ) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    // Validate date is not in the past
    const dateStr = format(formData.date, 'yyyy-MM-dd')
    if (isPastBooking(dateStr, formData.time)) {
      showToast('Cannot create bookings in the past', 'error')
      return
    }

    // Validate date is not too far in the future (max 2 months)
    const twoMonthsFromNow = addMonths(new Date(), 2)
    if (formData.date > twoMonthsFromNow) {
      showToast('Cannot create bookings more than 2 months in advance', 'error')
      return
    }

    // Check for conflicts before saving
    if (checkSelectedSlotsConflict?.hasConflict) {
      setConflictError(checkSelectedSlotsConflict.message)
      showToast(checkSelectedSlotsConflict.message, 'error')
      return
    }

    // Determine practiceId from dentist's branch
    const practiceId = formData.dentist.branch === 'Weltevreden Park' ? 'weltevreden' :
                      formData.dentist.branch === 'Ruimsig' ? 'ruimsig' :
                      'weltevreden' // Default fallback

    // Calculate end time based on number of slots
    const endTime = formData.selectedSlots[formData.selectedSlots.length - 1]
    const endTimeIndex = timeSlots.indexOf(endTime)
    const nextSlotIndex = endTimeIndex + 1
    const calculatedEndTime = nextSlotIndex < timeSlots.length ? timeSlots[nextSlotIndex] : endTime

    onSave({
      id: `BK-${Date.now()}`,
      practiceId: practiceId, // REQUIRED: Include practiceId
      patient: formData.patientName,
      email: formData.patientEmail,
      phone: formData.patientPhone,
      service: formData.service.name,
      dentist: formData.dentist.name,
      date: dateStr,
      time: formData.time,
      endTime: calculatedEndTime,
      duration: formData.slotCount * 15, // Duration in minutes
      slotCount: formData.slotCount,
      selectedSlots: formData.selectedSlots,
      status: 'confirmed',
      deposit: 0,
      total: formData.service.price,
      notes: formData.notes,
      recurrence: formData.recurrence,
      isRecurring: formData.recurrence !== null,
    })
    setConflictError(null)
    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.patientName && formData.patientEmail && formData.patientPhone
      case 2:
        return formData.service !== null && formData.dentist !== null
      case 3:
        return formData.date !== null && formData.time !== '' && formData.selectedSlots.length > 0
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">Create New Booking</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s === step
                        ? 'bg-gray-800 dark:bg-gray-600 text-white'
                        : s < step
                        ? 'bg-gray-600 dark:bg-gray-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        s < step ? 'bg-gray-600 dark:bg-gray-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Patient Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Patient Information
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="input-field pl-12"
                      placeholder="Enter patient name"
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
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="input-field pl-12"
                      placeholder="patient@email.com"
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
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="input-field pl-12"
                      placeholder="+27 82 123 4567"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Service & Dentist */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Appointment Details
                </h3>
                
                {/* Service Selection Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    What is this appointment for? *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.service?.id || ''}
                      onChange={(e) => {
                        const selectedService = SERVICES.find(s => s.id === e.target.value)
                        setFormData({ ...formData, service: selectedService || null })
                      }}
                      className="input-field appearance-none pr-10 cursor-pointer"
                      required
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - R{service.price} ({service.duration} min)
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formData.service && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{formData.service.name}</span>
                        <span className="text-gray-600 dark:text-gray-400"> - {formData.service.description}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        Duration: {formData.service.duration} minutes • Price: R{formData.service.price}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dentist Selection Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Which dentist would the patient like to see? *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.dentist?.id || ''}
                      onChange={(e) => {
                        const selectedDentist = DENTISTS.find(d => d.id === e.target.value)
                        setFormData({ ...formData, dentist: selectedDentist || null })
                      }}
                      className="input-field appearance-none pr-10 cursor-pointer"
                      required
                    >
                      <option value="">Select a dentist...</option>
                      {DENTISTS.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          {dentist.name} - {dentist.specialization}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formData.dentist && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{formData.dentist.name}</span>
                        <span className="text-gray-600 dark:text-gray-400"> - {formData.dentist.specialization}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {formData.dentist.qualifications} • {formData.dentist.experience} years experience
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Date, Time & Recurrence */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Date, Time & Payment
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Select Date *
                  </label>
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-700 text-left text-gray-800 dark:text-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className={formData.date ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-400 dark:text-gray-500'}>
                        {formData.date ? format(formData.date, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                      </span>
                    </div>
                  </button>
                  {isCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 calendar-wrapper"
                    >
                      <DayPicker
                        mode="single"
                        selected={formData.date || undefined}
                        onSelect={(date) => {
                          if (date) {
                            // Validate date before setting
                            if (isPast(date)) {
                              showToast('Cannot select dates in the past', 'error')
                              return
                            }
                            const twoMonthsFromNow = addMonths(new Date(), 2)
                            if (date > twoMonthsFromNow) {
                              showToast('Cannot select dates more than 2 months in advance', 'error')
                              return
                            }
                            setFormData({ ...formData, date, time: '', selectedSlots: [] })
                            setIsCalendarOpen(false)
                          }
                        }}
                        disabled={(date) => {
                          const day = date.getDay()
                          const isWeekend = day === 0 || day === 6
                          const isPastDate = isPast(date)
                          const twoMonthsFromNow = addMonths(new Date(), 2)
                          const isTooFarFuture = date > twoMonthsFromNow
                          return isWeekend || isPastDate || isTooFarFuture
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
                        .dark .calendar-wrapper .rdp {
                          --rdp-accent-color: #9ca3af;
                          --rdp-background-color: #1f2937;
                          --rdp-accent-color-dark: #6b7280;
                          --rdp-background-color-dark: #111827;
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
                          background-color: #1f2937 !important;
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
                    </motion.div>
                  )}
                </div>

                {formData.date && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Select Time & Duration *
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Duration:</span>
                        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                          {[1, 2, 3].map((count) => (
                            <button
                              key={count}
                              onClick={() => {
                                const newSlots = formData.time 
                                  ? getConsecutiveSlots(formData.time, count, timeSlots)
                                  : []
                                setFormData({
                                  ...formData,
                                  slotCount: count,
                                  selectedSlots: newSlots,
                                })
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                formData.slotCount === count
                                  ? 'bg-gray-800 dark:bg-gray-600 text-white'
                                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {count}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      {formData.selectedSlots.length > 0 && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg mb-3">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            <span className="font-medium">Selected:</span>{' '}
                            {formData.selectedSlots[0]} - {formData.selectedSlots[formData.selectedSlots.length - 1]}
                            {' '}({formData.slotCount * 15} minutes)
                          </p>
                        </div>
                      )}
                      {conflictError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3 flex items-start space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800 dark:text-red-200">{conflictError}</p>
                        </div>
                      )}
                      {checkSelectedSlotsConflict?.hasConflict && !conflictError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3 flex items-start space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800 dark:text-red-200">{checkSelectedSlotsConflict.message}</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                      {timeSlots.map((time, index) => {
                        const isSelected = formData.selectedSlots.includes(time)
                        const isStartSlot = formData.selectedSlots[0] === time
                        const isEndSlot = formData.selectedSlots[formData.selectedSlots.length - 1] === time
                        const isInRange = formData.selectedSlots.includes(time)
                        const isBooked = isSlotBooked(time)
                        
                        // Check if this slot can be selected (enough consecutive slots available and not booked)
                        const canSelect = !isBooked && index + formData.slotCount <= timeSlots.length
                        
                        return (
                          <motion.button
                            key={time}
                            onClick={() => canSelect && handleTimeSlotClick(time)}
                            disabled={!canSelect}
                            className={`p-3 rounded-lg border-2 text-center transition-all relative font-semibold ${
                              isSelected
                                ? 'border-gray-800 bg-gray-800 text-white shadow-md'
                                : isInRange
                                ? 'border-blue-400 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200'
                                : isBooked
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 opacity-60 cursor-not-allowed line-through'
                                : !canSelect
                                ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-500 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                            }`}
                            whileHover={canSelect && !isSelected ? { scale: 1.05, y: -2 } : {}}
                            whileTap={canSelect ? { scale: 0.95 } : {}}
                            title={
                              isBooked
                                ? 'This time slot is already booked'
                                : !canSelect
                                ? 'Not enough consecutive slots available'
                                : isSelected
                                ? 'Start time'
                                : ''
                            }
                          >
                            <span className="text-sm">{time}</span>
                            {isStartSlot && !isBooked && (
                              <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            {isBooked && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <X className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                            {isEndSlot && isStartSlot && formData.slotCount > 1 && !isBooked && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">E</span>
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Select a start time. The booking will span {formData.slotCount} consecutive slot{formData.slotCount > 1 ? 's' : ''} ({formData.slotCount * 15} minutes).
                    </p>
                  </div>
                )}

                {/* Recurrence Selector */}
                {formData.date && formData.time && (
                  <RecurrenceSelector
                    startDate={formData.date}
                    value={formData.recurrence}
                    onChange={(pattern) => setFormData({ ...formData, recurrence: pattern })}
                  />
                )}

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Service Total</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      R{formData.service?.price || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Payment is due on the day of the appointment
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Any additional notes about this booking..."
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  step === 1
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>Back</span>
              </button>

              {step < 3 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center space-x-2 text-sm ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Continue</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center space-x-2 text-sm ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Create Booking</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CreateBookingModal

