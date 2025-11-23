import { useState } from 'react'
import { testFirebaseConnection, testBookingsCollection, testPatientsCollection } from '../utils/testFirebase'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const TestFirebase = () => {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    connection: boolean | null
    bookings: boolean | null
    patients: boolean | null
  }>({
    connection: null,
    bookings: null,
    patients: null,
  })

  const runTests = async () => {
    setTesting(true)
    setResults({ connection: null, bookings: null, patients: null })

    try {
      // Test 1: Basic connection
      const connectionTest = await testFirebaseConnection()
      setResults((prev) => ({ ...prev, connection: connectionTest }))

      // Test 2: Bookings collection
      const bookingsTest = await testBookingsCollection()
      setResults((prev) => ({ ...prev, bookings: bookingsTest }))

      // Test 3: Patients collection
      const patientsTest = await testPatientsCollection()
      setResults((prev) => ({ ...prev, patients: patientsTest }))
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setTesting(false)
    }
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader className="w-5 h-5 animate-spin text-gray-400" />
    if (status) return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Pending'
    if (status) return 'Success'
    return 'Failed'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
            Firebase Connection Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Test your Firebase Firestore database connection
          </p>

          <button
            onClick={runTests}
            disabled={testing}
            className="w-full mb-6 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Running Tests...' : 'Run Firebase Tests'}
          </button>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(results.connection)}
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  Basic Connection
                </span>
              </div>
              <span className={`text-sm font-medium ${
                results.connection === null
                  ? 'text-gray-500'
                  : results.connection
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getStatusText(results.connection)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(results.bookings)}
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  Bookings Collection
                </span>
              </div>
              <span className={`text-sm font-medium ${
                results.bookings === null
                  ? 'text-gray-500'
                  : results.bookings
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getStatusText(results.bookings)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(results.patients)}
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  Patients Collection
                </span>
              </div>
              <span className={`text-sm font-medium ${
                results.patients === null
                  ? 'text-gray-500'
                  : results.patients
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {getStatusText(results.patients)}
              </span>
            </div>
          </div>

          {results.connection !== null && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Check the browser console (F12) for detailed test results and any error messages.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TestFirebase

