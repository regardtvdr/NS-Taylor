import { useMemo } from 'react'
import { DENTISTS } from '../utils/constants'
import { useUserPractices } from './useUserPractices'

/**
 * Maps practice IDs to branch names as used in DENTISTS array
 */
const PRACTICE_ID_TO_BRANCH: Record<string, string> = {
  ruimsig: 'Ruimsig',
  weltevreden: 'Weltevreden Park',
}

/**
 * Hook to get dentists filtered by the current user's practices
 * - Admins see all dentists
 * - Receptionists only see dentists from their assigned practices
 */
export const useFilteredDentists = () => {
  const { practices, isAdmin, loading } = useUserPractices()

  const filteredDentists = useMemo(() => {
    // If still loading, return empty array
    if (loading) {
      return []
    }

    // Admins see all dentists
    if (isAdmin) {
      return DENTISTS
    }

    // If no practices assigned, return empty array
    if (!practices || practices.length === 0) {
      return []
    }

    // Map practice IDs to branch names
    const allowedBranches = practices
      .map((practiceId) => PRACTICE_ID_TO_BRANCH[practiceId])
      .filter((branch) => branch !== undefined)

    // Filter dentists by branch
    return DENTISTS.filter((dentist) => {
      if (!dentist.branch) {
        return false // Exclude dentists without a branch
      }
      return allowedBranches.includes(dentist.branch)
    })
  }, [practices, isAdmin, loading])

  return {
    dentists: filteredDentists,
    loading,
    isAdmin,
  }
}

