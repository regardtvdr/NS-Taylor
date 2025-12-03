import { useState, useEffect, useCallback } from 'react'
import { patientsServiceMethods } from '../services/patientsService'
import { Patient } from '../types'
import { useToast } from '../contexts/ToastContext'

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await patientsServiceMethods.getAll()
      setPatients(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patients'
      setError(errorMessage)
      // Only show toast if it's not a permission error (public users can't load patients)
      if (!errorMessage.includes('permission') && !errorMessage.includes('Permission')) {
        showToast(errorMessage, 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadPatients()
  }, [loadPatients])

  const searchPatients = useCallback(async (searchTerm: string): Promise<Patient[]> => {
    try {
      if (!searchTerm.trim()) {
        return patients
      }
      return await patientsServiceMethods.search(searchTerm)
    } catch (err) {
      // If search fails due to permissions (public users can't read patients), return empty array
      // This allows the booking flow to continue and create a new patient
      const errorMessage = err instanceof Error ? err.message : 'Failed to search patients'
      if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
        // Silently return empty array for permission errors (public users)
        return []
      }
      // Only show toast for other errors (staff users)
      showToast(errorMessage, 'error')
      return []
    }
  }, [patients, showToast])

  const getPatientById = useCallback(async (id: string): Promise<Patient | null> => {
    try {
      return await patientsServiceMethods.getById(id)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patient'
      showToast(errorMessage, 'error')
      return null
    }
  }, [showToast])

  const createPatient = useCallback(async (patient: Omit<Patient, 'id' | 'createdAt' | 'lastVisit' | 'totalVisits' | 'totalSpent'>, options?: { silent?: boolean }) => {
    try {
      const id = await patientsServiceMethods.create(patient)
      await loadPatients()
      // Only show toast if not silent (for staff-side operations)
      if (!options?.silent) {
        showToast('Patient created successfully!', 'success')
      }
      return id
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create patient'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadPatients, showToast])

  const updatePatient = useCallback(async (id: string, patient: Partial<Patient>) => {
    try {
      await patientsServiceMethods.update(id, patient)
      await loadPatients()
      showToast('Patient updated successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update patient'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadPatients, showToast])

  const deletePatient = useCallback(async (id: string) => {
    try {
      await patientsServiceMethods.delete(id)
      await loadPatients()
      showToast('Patient deleted successfully!', 'success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete patient'
      showToast(errorMessage, 'error')
      throw err
    }
  }, [loadPatients, showToast])

  return {
    patients,
    loading,
    error,
    loadPatients,
    searchPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
  }
}

