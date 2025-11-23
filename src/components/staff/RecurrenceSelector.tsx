import { useState } from 'react'
import { Calendar, Repeat, X } from 'lucide-react'
import { RecurrencePattern, RecurrenceFrequency } from '../../types'
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns'

interface RecurrenceSelectorProps {
  startDate: Date | null
  value: RecurrencePattern | null
  onChange: (pattern: RecurrencePattern | null) => void
}

const RecurrenceSelector = ({ startDate, value, onChange }: RecurrenceSelectorProps) => {
  const [isRecurring, setIsRecurring] = useState(value !== null)
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(value?.frequency || 'weekly')
  const [interval, setInterval] = useState(value?.interval || 1)
  const [endType, setEndType] = useState<'never' | 'date' | 'occurrences'>(value?.endDate ? 'date' : value?.occurrences ? 'occurrences' : 'never')
  const [endDate, setEndDate] = useState(value?.endDate || '')
  const [occurrences, setOccurrences] = useState(value?.occurrences || 10)
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(value?.daysOfWeek || [])

  const weekDays = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
  ]

  const handleToggle = (enabled: boolean) => {
    setIsRecurring(enabled)
    if (!enabled) {
      onChange(null)
    } else {
      // Initialize with default pattern
      const defaultPattern: RecurrencePattern = {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: startDate ? [startDate.getDay()] : [],
      }
      onChange(defaultPattern)
      setFrequency('weekly')
      setInterval(1)
      setDaysOfWeek(startDate ? [startDate.getDay()] : [])
    }
  }

  const handleFrequencyChange = (newFrequency: RecurrenceFrequency) => {
    setFrequency(newFrequency)
    updatePattern({ frequency: newFrequency })
  }

  const handleIntervalChange = (newInterval: number) => {
    setInterval(newInterval)
    updatePattern({ interval: newInterval })
  }

  const handleEndTypeChange = (newEndType: 'never' | 'date' | 'occurrences') => {
    setEndType(newEndType)
    if (newEndType === 'never') {
      updatePattern({ endDate: undefined, occurrences: undefined })
    } else if (newEndType === 'date') {
      updatePattern({ endDate: endDate || undefined, occurrences: undefined })
    } else {
      updatePattern({ occurrences: occurrences, endDate: undefined })
    }
  }

  const handleEndDateChange = (date: string) => {
    setEndDate(date)
    updatePattern({ endDate: date, occurrences: undefined })
  }

  const handleOccurrencesChange = (count: number) => {
    setOccurrences(count)
    updatePattern({ occurrences: count, endDate: undefined })
  }

  const handleDayToggle = (day: number) => {
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day].sort()
    setDaysOfWeek(newDays)
    updatePattern({ daysOfWeek: newDays })
  }

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    if (!isRecurring) return
    
    const newPattern: RecurrencePattern = {
      frequency,
      interval,
      daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
      ...updates,
    }
    
    if (endType === 'date' && updates.endDate !== undefined) {
      newPattern.endDate = updates.endDate
    } else if (endType === 'occurrences' && updates.occurrences !== undefined) {
      newPattern.occurrences = updates.occurrences
    } else if (endType === 'date') {
      newPattern.endDate = endDate || undefined
    } else if (endType === 'occurrences') {
      newPattern.occurrences = occurrences
    }

    onChange(newPattern)
  }

  const getPreviewText = () => {
    if (!isRecurring || !startDate) return ''
    
    const frequencyText = {
      daily: interval === 1 ? 'Daily' : `Every ${interval} days`,
      weekly: interval === 1 ? 'Weekly' : `Every ${interval} weeks`,
      monthly: interval === 1 ? 'Monthly' : `Every ${interval} months`,
      yearly: interval === 1 ? 'Yearly' : `Every ${interval} years`,
      none: 'No recurrence',
    }[frequency]

    let preview = frequencyText

    if (frequency === 'weekly' && daysOfWeek.length > 0) {
      const dayNames = daysOfWeek.map(d => weekDays[d].label).join(', ')
      preview = `${frequencyText} on ${dayNames}`
    }

    if (endType === 'date' && endDate) {
      preview += ` until ${format(new Date(endDate), 'MMM d, yyyy')}`
    } else if (endType === 'occurrences') {
      preview += ` (${occurrences} times)`
    }

    return preview
  }

  return (
    <div className="space-y-4">
      {/* Toggle Recurrence */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Repeat className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-800 dark:text-gray-100">Recurring Appointment</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-800 dark:peer-checked:bg-gray-600"></div>
        </label>
      </div>

      {isRecurring && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Repeat Every
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(['daily', 'weekly', 'monthly', 'yearly'] as RecurrenceFrequency[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => handleFrequencyChange(freq)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    frequency === freq
                      ? 'bg-gray-800 dark:bg-gray-600 text-white dark:text-gray-100'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
            
            {frequency !== 'daily' && (
              <div className="mt-2">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Interval
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={interval}
                  onChange={(e) => handleIntervalChange(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {frequency === 'weekly' && interval === 1 ? 'week' : frequency === 'weekly' ? 'weeks' : 
                   frequency === 'monthly' && interval === 1 ? 'month' : 'months'}
                </span>
              </div>
            )}
          </div>

          {/* Days of Week (for weekly) */}
          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Repeat On
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => handleDayToggle(day.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      daysOfWeek.includes(day.value)
                        ? 'bg-gray-800 dark:bg-gray-600 text-white dark:text-gray-100'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* End Date Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              End Recurrence
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="endType"
                  value="never"
                  checked={endType === 'never'}
                  onChange={() => handleEndTypeChange('never')}
                  className="w-4 h-4 text-gray-800 dark:text-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Never</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="endType"
                  value="date"
                  checked={endType === 'date'}
                  onChange={() => handleEndTypeChange('date')}
                  className="w-4 h-4 text-gray-800 dark:text-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">On Date:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  min={startDate ? format(addDays(startDate, 1), 'yyyy-MM-dd') : undefined}
                  className="ml-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm"
                  disabled={endType !== 'date'}
                />
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="endType"
                  value="occurrences"
                  checked={endType === 'occurrences'}
                  onChange={() => handleEndTypeChange('occurrences')}
                  className="w-4 h-4 text-gray-800 dark:text-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">After:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={occurrences}
                  onChange={(e) => handleOccurrencesChange(parseInt(e.target.value) || 1)}
                  className="ml-2 w-20 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm"
                  disabled={endType !== 'occurrences'}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">occurrences</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {getPreviewText() && (
            <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {getPreviewText()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RecurrenceSelector

