import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { Calendar, Circle } from 'lucide-react'
import { generateTimeSlots } from '../../utils/dateUtils'
import { BookingDetail } from '../../types'
import 'react-day-picker/dist/style.css'

interface DateTimeSelectionProps {
  selectedDate: Date | null
  selectedTime: string
  selectedDentist: string | null
  bookings: BookingDetail[]
  onDateSelect: (date: Date) => void
  onTimeSelect: (time: string) => void
}

const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  selectedDentist,
  bookings,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectionProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []

  // Check if a time slot is booked for the selected dentist and date
  const isSlotBooked = useMemo(() => {
    if (!selectedDate || !selectedDentist) return () => false
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const bookedSlots = new Set(
      bookings
        .filter(b => 
          b.date === dateStr && 
          b.dentist === selectedDentist && 
          b.status !== 'cancelled' &&
          b.status !== 'no-show'
        )
        .map(b => b.time)
    )
    
    return (time: string) => bookedSlots.has(time)
  }, [selectedDate, selectedDentist, bookings])

  const getSlotStatus = (time: string): 'available' | 'booked' | 'unavailable' => {
    if (!selectedDentist) return 'unavailable'
    if (isSlotBooked(time)) return 'booked'
    return 'available'
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Choose Date & Time
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Select your preferred appointment slot</p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
          Select Date
        </label>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full p-3 md:p-3.5 border border-gray-200 rounded-md flex items-center justify-between hover:border-gray-400 transition-colors bg-white text-left focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
        >
          <div className="flex items-center space-x-2 md:space-x-2.5 min-w-0 flex-1">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={`truncate ${selectedDate ? 'text-gray-800 font-medium text-xs md:text-sm' : 'text-gray-400 text-xs md:text-sm'}`}>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {isCalendarOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 bg-white rounded-lg shadow-lg p-3 md:p-4 border border-gray-200 calendar-wrapper overflow-x-auto"
            >
              <DayPicker
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => {
                  if (date) {
                    onDateSelect(date)
                    setIsCalendarOpen(false)
                  }
                }}
                disabled={(date) => {
                  const day = date.getDay()
                  return day === 0 || day === 6 // Disable weekends
                }}
                modifiersClassNames={{
                  selected: 'bg-gray-800 text-white rounded-full',
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
                .calendar-wrapper .rdp-day {
                  width: var(--rdp-cell-size);
                  height: var(--rdp-cell-size);
                  font-weight: 500;
                  color: #1f2937;
                  border: 1px solid transparent;
                  border-radius: 8px;
                  transition: all 0.2s;
                }
                .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled):not(.rdp-day_selected) {
                  background-color: #f3f4f6;
                  border-color: #d1d5db;
                  color: #111827;
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
                .calendar-wrapper .rdp-day_today:not(.rdp-day_selected) {
                  border: 2px solid #6b7280;
                }
                .calendar-wrapper .rdp-day_disabled {
                  color: #d1d5db;
                  opacity: 0.5;
                }
                .calendar-wrapper .rdp-caption {
                  font-weight: 600;
                  font-size: 16px;
                  color: #111827;
                  padding: 8px 0;
                  margin-bottom: 8px;
                }
                .calendar-wrapper .rdp-button {
                  color: #374151;
                }
                .calendar-wrapper .rdp-button:hover {
                  background-color: #f3f4f6;
                }
                .calendar-wrapper .rdp-nav_button {
                  width: 32px;
                  height: 32px;
                }
                .calendar-wrapper .rdp-nav_button:hover {
                  background-color: #f3f4f6;
                  border-radius: 6px;
                }
              `}</style>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time Selection */}
      {selectedDate ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Available Times
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {timeSlots.map((time) => {
              const status = getSlotStatus(time)
              const isSelected = selectedTime === time
              const isBooked = status === 'booked'

              return (
                <motion.button
                  key={time}
                  onClick={() => !isBooked && onTimeSelect(time)}
                  disabled={isBooked}
                  className={`relative p-2 md:p-2.5 rounded-md border transition-all duration-200 text-center ${
                    isSelected
                      ? 'border-gray-700 bg-gray-100 text-gray-900'
                      : isBooked
                      ? 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed text-red-600 line-through'
                      : status === 'available'
                      ? 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                      : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                  whileHover={!isBooked && !isSelected ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isBooked ? { scale: 0.95 } : {}}
                  title={isBooked ? 'This time slot is already booked' : ''}
                >
                  <span className="text-xs md:text-sm font-semibold">{time}</span>
                  {status === 'available' && !isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <Circle className="w-2 h-2 text-green-500 fill-green-500" />
                    </div>
                  )}
                  {isBooked && (
                    <div className="absolute top-1.5 right-1.5">
                      <Circle className="w-2 h-2 text-red-500 fill-red-500" />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1.5">
              <Circle className="w-2 h-2 text-green-500 fill-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Circle className="w-2 h-2 text-red-500 fill-red-500" />
              <span>Booked</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 p-4 border border-gray-100 rounded-md bg-gray-50/50">
          <p className="text-xs text-gray-400 text-center">
            Please select a date above to view available time slots
          </p>
        </div>
      )}
    </div>
  )
}

export default DateTimeSelection

