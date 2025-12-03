import { useState, useEffect, useCallback } from 'react'
import { practicesService, Practice } from '../services/practicesService'
import { useToast } from '../contexts/ToastContext'

export const usePractices = () => {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const loadPractices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await practicesService.getAll()
      setPractices(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load practices'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadPractices()
  }, [loadPractices])

  const getPracticeById = useCallback((id: string): Practice | undefined => {
    return practices.find(p => p.id === id)
  }, [practices])

  const getPracticeName = useCallback((practiceId: string): string => {
    const practice = getPracticeById(practiceId)
    return practice?.name || practiceId
  }, [getPracticeById])

  return {
    practices,
    loading,
    error,
    loadPractices,
    getPracticeById,
    getPracticeName,
  }
}

