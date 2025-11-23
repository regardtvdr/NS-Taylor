import { motion } from 'framer-motion'
import { AlertTriangle, Check, Clock } from 'lucide-react'

interface DisclaimerStepProps {
  accepted: boolean
  onAccept: (accepted: boolean) => void
}

const DisclaimerStep = ({ accepted, onAccept }: DisclaimerStepProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Cancellation Policy
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Please read and accept our cancellation policy to continue</p>
      </div>

      {/* Disclaimer Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 md:p-6"
      >
        <div className="flex items-start space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-amber-900 mb-2">
              Important Cancellation Policy
            </h3>
            <div className="space-y-3 text-sm md:text-base text-amber-800">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>All cancellations must be made at least 1 hour before your scheduled appointment time.</strong>
                </p>
              </div>
              <p className="pl-7">
                If you cancel less than 1 hour before your appointment or fail to show up, you will be billed for the appointment.
              </p>
              <p className="pl-7 text-xs md:text-sm">
                This policy helps us manage our schedule effectively and ensures we can serve all our patients efficiently.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Acceptance Checkbox */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 md:p-6"
      >
        <label className="flex items-start space-x-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => onAccept(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                accepted
                  ? 'bg-gray-800 border-gray-800'
                  : 'bg-white border-gray-400 group-hover:border-gray-600'
              }`}
            >
              {accepted && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-medium text-gray-800">
              I understand and accept the cancellation policy
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              By checking this box, I acknowledge that I will be billed if I cancel less than 1 hour before my appointment or fail to show up.
            </p>
          </div>
        </label>
      </motion.div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm text-blue-800">
          <strong>Need to cancel?</strong> You can use the cancellation link in your confirmation email, or call us at{' '}
          <a href="tel:+27111234567" className="underline font-semibold">
            +27 11 123 4567
          </a>{' '}
          at least 1 hour before your appointment.
        </p>
      </div>
    </div>
  )
}

export default DisclaimerStep

