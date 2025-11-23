import { FirestoreService } from './firestore'
import { Patient } from '../types'
import { orderBy } from 'firebase/firestore'

const patientsService = new FirestoreService('patients')

export interface FirestorePatient extends Omit<Patient, 'createdAt' | 'lastVisit'> {
  createdAt?: any
  lastVisit?: any
}

// Convert Firestore patient to app patient format
const convertFirestorePatient = (fp: FirestorePatient & { id: string }): Patient => {
  return {
    id: fp.id,
    firstName: fp.firstName,
    lastName: fp.lastName,
    email: fp.email,
    phone: fp.phone,
    idNumber: fp.idNumber,
    dateOfBirth: fp.dateOfBirth,
    address: fp.address,
    medicalAid: fp.medicalAid,
    notes: fp.notes,
    createdAt: fp.createdAt?.toDate?.().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    lastVisit: fp.lastVisit?.toDate?.().toISOString().split('T')[0],
    totalVisits: fp.totalVisits || 0,
    totalSpent: fp.totalSpent || 0,
  }
}

export const patientsServiceMethods = {
  // Get all patients
  async getAll(): Promise<Patient[]> {
    const patients = await patientsService.getAll([orderBy('lastName', 'asc')])
    return patients.map((p) => convertFirestorePatient({ ...p, id: p.id || '' } as FirestorePatient & { id: string }))
  },

  // Search patients by name, email, or phone
  async search(searchTerm: string): Promise<Patient[]> {
    const allPatients = await patientsService.getAll()
    const lowerSearchTerm = searchTerm.toLowerCase()
    
    return allPatients
      .map((p) => convertFirestorePatient({ ...p, id: p.id || '' } as FirestorePatient & { id: string }))
      .filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        return (
          fullName.includes(lowerSearchTerm) ||
          patient.email?.toLowerCase().includes(lowerSearchTerm) ||
          patient.phone?.toLowerCase().includes(lowerSearchTerm)
        )
      })
  },

  // Get a single patient by ID
  async getById(id: string): Promise<Patient | null> {
    const patient = await patientsService.getById(id)
    if (!patient) return null
    return convertFirestorePatient({ ...patient, id } as FirestorePatient & { id: string })
  },

  // Create a new patient
  async create(patient: Omit<Patient, 'id' | 'createdAt' | 'lastVisit' | 'totalVisits' | 'totalSpent'>): Promise<string> {
    const patientData = {
      ...patient,
      createdAt: new Date(),
      totalVisits: 0,
      totalSpent: 0,
    }
    return await patientsService.create(patientData)
  },

  // Update a patient
  async update(id: string, patient: Partial<Patient>): Promise<void> {
    await patientsService.update(id, patient)
  },

  // Delete a patient
  async delete(id: string): Promise<void> {
    await patientsService.delete(id)
  },
}

