import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { practicesService } from '../../services/practicesService'
import { useToast } from '../../contexts/ToastContext'

const InitializePractices = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const { showToast } = useToast()

  const handleInitialize = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      await practicesService.initializeDefaults()
      setResult({
        success: true,
        message: 'Practices initialized successfully! Both Weltevreden Park and Ruimsig have been created.'
      })
      showToast('Practices initialized successfully!', 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize practices'
      setResult({
        success: false,
        message: errorMessage
      })
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-2">
            Initialize Practices Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This will create the default practice documents (Weltevreden Park and Ruimsig) in Firestore if they don't already exist.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What this does:</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Creates <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">weltevreden</code> practice document</li>
                <li>Creates <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">ruimsig</code> practice document</li>
                <li>Only creates if they don't already exist (safe to run multiple times)</li>
              </ul>
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
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Initialize Practices</span>
              </>
            )}
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
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
              <p className={`text-sm ${
                result.success
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {result.message}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default InitializePractices

