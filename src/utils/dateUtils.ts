import { format, addDays, startOfDay } from 'date-fns'

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy')
}

export const formatTime = (time: string): string => {
  return time
}

export const getAvailableDates = (): Date[] => {
  const dates: Date[] = []
  const today = startOfDay(new Date())
  
  for (let i = 1; i <= 30; i++) {
    dates.push(addDays(today, i))
  }
  
  return dates
}

export const isDateAvailable = (_date: Date): boolean => {
  // Mock: exclude weekends for demo
  const day = _date.getDay()
  return day !== 0 && day !== 6
}

export const generateTimeSlots = (date: Date): string[] => {
  const slots: string[] = []
  const startHour = 8
  const endHour = 17
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:15`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
    if (hour < endHour - 1) {
      slots.push(`${hour.toString().padStart(2, '0')}:45`)
    }
  }
  
  return slots
}

