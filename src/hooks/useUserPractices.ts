import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { User } from '../types'

export const useUserPractices = () => {
  const [userData, setUserData] = useState<User | null>(null)
  const [practices, setPractices] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUserData(null)
        setPractices([])
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const data = userDoc.data() as Omit<User, 'id'>
          const userWithId: User = {
            ...data,
            id: userDoc.id,
          }
          setUserData(userWithId)
          setPractices(data.practices || [])
          setIsAdmin(data.role === 'admin')
        } else {
          // User document doesn't exist - might be a new user
          setUserData(null)
          setPractices([])
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUserData(null)
        setPractices([])
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    userData,
    practices,
    isAdmin,
    loading,
  }
}

