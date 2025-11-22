import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { Calendar, Circle } from 'lucide-react'
import { generateTimeSlots } from '../../utils/dateUtils'
import 'react-day-picker/dist/style.css'

interface DateTimeSelectionProps {
  selectedDate: Date | null
  selectedTime: string
  onDateSelect: (date: Date) => void
  onTimeSelect: (time: string) => void
}

const DateTimeSelection = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectionProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : []

  const getSlotStatus = (time: string): 'available' | 'limited' | 'unavailable' => {
    // Mock availability logic
    const hour = parseInt(time.split(':')[0])
    if (hour >= 8 && hour <= 10) return 'available'
    if (hour >= 11 && hour <= 13) return 'limited'
    return 'unavailable'
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Choose Date & Time
        </h2>
        <p className="text-sm text-gray-500">Select your preferred appointment slot</p>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
          Select Date
        </label>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full p-3.5 border border-gray-200 rounded-md flex items-center justify-between hover:border-gray-400 transition-colors bg-white text-left focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500"
        >
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={selectedDate ? 'text-gray-800 font-medium text-sm' : 'text-gray-400 text-sm'}>
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
              className="mt-3 bg-white rounded-md shadow-md p-4 border border-gray-200"
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
          <label className="block text-xs font-medium text-gray-700 mb-2.5 uppercase tracking-wide">
            Available Times
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
            {timeSlots.map((time) => {
              const status = getSlotStatus(time)
              const isSelected = selectedTime === time

              return (
                <motion.button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  disabled={status === 'unavailable'}
                  className={`relative p-2.5 rounded-md border transition-all duration-200 text-center ${
                    isSelected
                      ? 'border-gray-700 bg-gray-100 text-gray-900'
                      : status === 'available'
                      ? 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                      : status === 'limited'
                      ? 'border-gray-200 bg-gray-50 hover:border-gray-400 text-gray-600'
                      : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed text-gray-400'
                  }`}
                  whileHover={status !== 'unavailable' && !isSelected ? { scale: 1.02 } : {}}
                  whileTap={status !== 'unavailable' ? { scale: 0.98 } : {}}
                >
                  <span className="font-medium text-xs">{time}</span>
                  {status === 'available' && !isSelected && (
                    <div className="absolute top-1 right-1">
                      <Circle className="w-1.5 h-1.5 text-green-500 fill-green-500" />
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
              <Circle className="w-2 h-2 text-gray-400 fill-gray-400" />
              <span>Limited</span>
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

