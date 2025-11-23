import { FirestoreService, timestampToDateString, dateStringToTimestamp } from './firestore'
import { query, where, orderBy, collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { BookingDetail } from '../types'

const bookingsService = new FirestoreService('bookings')

export interface FirestoreBooking {
  id?: string
  patient: string
  email?: string
  phone?: string
  service: string
  dentist: string
  date: string | any
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'arrived' | 'no-show'
  deposit?: number
  total?: number
  isRecurring?: boolean
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    daysOfWeek?: number[]
    endDate?: string
    occurrences?: number
  }
  createdAt?: any
  updatedAt?: any
}

// Convert Firestore booking to app booking format
const convertFirestoreBooking = (fb: FirestoreBooking): BookingDetail => {
  return {
    id: fb.id || '',
    patient: fb.patient,
    email: fb.email || '',
    phone: fb.phone || '',
    service: fb.service,
    dentist: fb.dentist,
    date: timestampToDateString(fb.date),
    time: fb.time,
    status: fb.status,
    deposit: fb.deposit || 0,
    total: fb.total || 0,
    isRecurring: fb.isRecurring || false,
    recurrence: fb.recurrence,
  }
}

// Convert app booking to Firestore format
const convertToFirestore = (booking: Partial<BookingDetail>): Partial<FirestoreBooking> => {
  const firestoreBooking: Partial<FirestoreBooking> = {
    patient: booking.patient,
    email: booking.email,
    phone: booking.phone,
    service: booking.service,
    dentist: booking.dentist,
    date: booking.date ? dateStringToTimestamp(booking.date) : undefined,
    time: booking.time,
    status: booking.status,
    deposit: booking.deposit,
    total: booking.total,
    isRecurring: booking.isRecurring,
    recurrence: booking.recurrence && booking.recurrence.frequency !== 'none' ? {
      frequency: booking.recurrence.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
      interval: booking.recurrence.interval,
      daysOfWeek: booking.recurrence.daysOfWeek,
      endDate: booking.recurrence.endDate,
      occurrences: booking.recurrence.occurrences,
    } : undefined,
  }
  
  // Remove undefined fields
  Object.keys(firestoreBooking).forEach(
    (key) => firestoreBooking[key as keyof FirestoreBooking] === undefined && delete firestoreBooking[key as keyof FirestoreBooking]
  )
  
  return firestoreBooking
}

export const bookingsServiceMethods = {
  // Get all bookings
  async getAll(): Promise<BookingDetail[]> {
    const collectionRef = collection(db, 'bookings')
    const q = query(collectionRef, orderBy('date', 'desc'), orderBy('time', 'asc'))
    const querySnapshot = await getDocs(q)
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return bookings.map((b) => convertFirestoreBooking(b as FirestoreBooking))
  },

  // Get bookings for a specific date
  async getByDate(date: string): Promise<BookingDetail[]> {
    const dateTimestamp = dateStringToTimestamp(date)
    const bookings = await bookingsService.getWhere('date', '==', dateTimestamp)
    return bookings.map((b) => convertFirestoreBooking(b as FirestoreBooking))
  },

  // Get bookings for a date range
  async getByDateRange(startDate: string, endDate: string): Promise<BookingDetail[]> {
    const start = dateStringToTimestamp(startDate)
    const end = dateStringToTimestamp(endDate)
    
    const collectionRef = collection(db, 'bookings')
    const q = query(
      collectionRef,
      where('date', '>=', start),
      where('date', '<=', end),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreBooking[]
    return bookings.map(convertFirestoreBooking)
  },

  // Get bookings by dentist
  async getByDentist(dentist: string, date?: string): Promise<BookingDetail[]> {
    const collectionRef = collection(db, 'bookings')
    const constraints: any[] = [where('dentist', '==', dentist)]
    
    if (date) {
      constraints.push(where('date', '==', dateStringToTimestamp(date)))
    }
    
    constraints.push(orderBy('time', 'asc'))
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)
    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return bookings.map((b) => convertFirestoreBooking(b as FirestoreBooking))
  },

  // Get bookings by status
  async getByStatus(status: string): Promise<BookingDetail[]> {
    const bookings = await bookingsService.getWhere('status', '==', status)
    return bookings.map((b) => convertFirestoreBooking(b as FirestoreBooking))
  },

  // Get a single booking by ID
  async getById(id: string): Promise<BookingDetail | null> {
    const booking = await bookingsService.getById(id)
    if (!booking) return null
    return convertFirestoreBooking({ ...booking, id } as FirestoreBooking)
  },

  // Create a new booking
  async create(booking: Partial<BookingDetail>): Promise<string> {
    const firestoreData = convertToFirestore(booking)
    return await bookingsService.create(firestoreData)
  },

  // Update a booking
  async update(id: string, booking: Partial<BookingDetail>): Promise<void> {
    const firestoreData = convertToFirestore(booking)
    await bookingsService.update(id, firestoreData)
  },

  // Delete a booking
  async delete(id: string): Promise<void> {
    await bookingsService.delete(id)
  },

  // Update booking status
  async updateStatus(id: string, status: BookingDetail['status']): Promise<void> {
    await bookingsService.update(id, { status })
  },
}

