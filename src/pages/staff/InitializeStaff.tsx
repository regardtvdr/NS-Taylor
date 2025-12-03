import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../config/firebase'
import { useToast } from '../../contexts/ToastContext'

interface StaffUser {
  email: string
  password: string
  name: string
  role: 'admin' | 'dentist' | 'reception'
  practices: string[]
}

// Default staff accounts to create
const DEFAULT_STAFF: StaffUser[] = [
  {
    email: 'admin@drnstaylor.co.za',
    password: 'Admin2025!',
    name: 'Admin User',
    role: 'admin',
    practices: ['ruimsig', 'weltevreden'], // Admin has access to all
  },
  {
    email: 'reception.ruimsig@drnstaylor.co.za',
    password: 'Reception2025!',
    name: 'Ruimsig Reception',
    role: 'reception',
    practices: ['ruimsig'],
  },
  {
    email: 'reception.weltevreden@drnstaylor.co.za',
    password: 'Reception2025!',
    name: 'Weltevreden Reception',
    role: 'reception',
    practices: ['weltevreden'],
  },
]

const InitializeStaff = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Array<{ email: string; success: boolean; message: string }>>([])
  const { showToast } = useToast()

  const handleInitialize = async () => {
    setLoading(true)
    setResults([])

    const newResults: Array<{ email: string; success: boolean; message: string }> = []

    for (const staff of DEFAULT_STAFF) {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, staff.email, staff.password)
        const user = userCredential.user

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: staff.name,
          email: staff.email,
          role: staff.role,
          practices: staff.practices,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        newResults.push({
          email: staff.email,
          success: true,
          message: `Created successfully (${staff.role})`,
        })
      } catch (error: any) {
        const errorMessage = error.code === 'auth/email-already-in-use'
          ? 'User already exists'
          : error.message || 'Failed to create user'
        
        newResults.push({
          email: staff.email,
          success: false,
          message: errorMessage,
        })
      }
    }

    setResults(newResults)
    setLoading(false)

    const successCount = newResults.filter(r => r.success).length
    if (successCount > 0) {
      showToast(`Created ${successCount} staff account(s)`, 'success')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
            Initialize Staff Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will create default staff accounts with Firebase Auth. Each account will have access to their assigned practice(s).
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Default Staff Accounts:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                {DEFAULT_STAFF.map((staff, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                      {staff.email}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      - {staff.name} ({staff.role}) - Practices: {staff.practices.join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                Default password for all accounts: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Reception2025!</code> (except admin: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Admin2025!</code>)
              </p>
            </div>
          </div>

          <button
            onClick={handleInitialize}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating accounts...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Initialize Staff Accounts</span>
              </>
            )}
          </button>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-2"
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Results:</h3>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-start space-x-3 ${
                    result.success
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      result.success
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.email}
                    </p>
                    <p className={`text-xs ${
                      result.success
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default InitializeStaff

