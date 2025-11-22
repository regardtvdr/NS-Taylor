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
  paymentMethod: 'ozow' | 'payfast' | null
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

