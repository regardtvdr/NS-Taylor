export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  icon: string
}

export interface TimeSlot {
  time: string
  available: boolean
  status: 'available' | 'limited' | 'unavailable'
}

export interface Dentist {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  reviews: number
  qualifications?: string
  bio?: string
  avatar?: string
  branch?: string
}

export interface Staff {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  branch: string
}

export interface BookingData {
  service: Service | null
  dentist: Dentist | null
  date: Date | null
  time: string
  patientDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    idNumber?: string
  }
  reminders: {
    sms: boolean
    whatsapp: boolean
    calendar: boolean
  }
  disclaimerAccepted: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  avatar: string
}

export interface Appointment {
  id: string
  service: string
  date: string
  time: string
  patient: string
  status: 'confirmed' | 'pending' | 'cancelled'
  deposit: number
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  idNumber?: string
  dateOfBirth?: string
  address?: string
  medicalAid?: string
  medicalAidNumber?: string
  allergies?: string[]
  notes?: string
  createdAt: string
  lastVisit?: string
  totalVisits: number
  totalSpent: number
}

export interface PatientHistory {
  id: string
  patientId: string
  appointmentId: string
  date: string
  service: string
  dentist: string
  amount: number
  deposit: number
  status: 'completed' | 'cancelled' | 'no-show'
  notes?: string
  treatmentNotes?: string
}

export interface PaymentRecord {
  id: string
  patientId: string
  appointmentId: string
  date: string
  amount: number
  deposit: number
  method: 'ozow' | 'payfast' | 'cash' | 'card' | 'medical-aid'
  status: 'paid' | 'pending' | 'refunded'
}

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none'

export interface RecurrencePattern {
  frequency: RecurrenceFrequency
  interval: number // Every X days/weeks/months
  endDate?: string // End date for recurrence (YYYY-MM-DD)
  occurrences?: number // Number of occurrences
  daysOfWeek?: number[] // For weekly: [0=Sunday, 1=Monday, etc.]
  dayOfMonth?: number // For monthly: day of month (1-31)
  weekOfMonth?: number // For monthly: which week (1-4, -1 for last)
}

export interface RecurringAppointment {
  seriesId: string // Unique ID for the recurring series
  pattern: RecurrencePattern
  startDate: string
  endDate?: string
  totalOccurrences?: number
  createdOccurrences: number
}

export interface BookingDetail {
  id: string
  practiceId: string // Required: 'ruimsig' | 'weltevreden'
  patient: string
  email?: string
  phone?: string
  service: string
  dentist: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'arrived' | 'no-show'
  source?: 'online' | 'phone' | 'walk-in'
  deposit?: number
  total?: number
  duration?: number // Duration in minutes
  isRecurring?: boolean
  recurrence?: RecurrencePattern
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface ScheduleAppointment {
  id: string
  time: string
  patient: string
  service: string
  dentist: string
  depositPaid: boolean
  status: 'scheduled' | 'arrived' | 'no-show' | 'completed'
  phone?: string
  email?: string
  date: string
  total?: number
}

export interface Practice {
  id: string
  name: string
  address: string
  phone: string
  email: string
  timezone: string
  registrationNumber?: string
  practiceNumber?: string
  workingHours: {
    monday: { open: string; close: string } | null
    tuesday: { open: string; close: string } | null
    wednesday: { open: string; close: string } | null
    thursday: { open: string; close: string } | null
    friday: { open: string; close: string } | null
    saturday: { open: string; close: string } | null
    sunday: { open: string; close: string } | null
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'dentist' | 'reception'
  practices: string[] // Array of practice IDs the user has access to
  phone?: string
  createdAt?: Date
  updatedAt?: Date
}

