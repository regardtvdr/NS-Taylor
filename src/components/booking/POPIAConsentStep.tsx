import { motion } from 'framer-motion'
import { Shield, Check, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface POPIAConsentStepProps {
  accepted: boolean
  onAccept: (accepted: boolean) => void
}

const POPIAConsentStep = ({ accepted, onAccept }: POPIAConsentStepProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          POPIA Consent & Disclaimer
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Please read and accept our data protection policy to continue</p>
      </div>

      {/* POPIA Consent Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 border-2 rounded-lg p-4 md:p-6"
        style={{ borderColor: '#4E4D50' }}
      >
        <div className="flex items-start space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4E4D50' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
              Protection of Personal Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              By completing and submitting this booking form you agree that:
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm md:text-base text-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4E4D50' }} />
            <p>
              <strong>Dr. NS Taylor & Associates Inc.</strong> may collect and process your personal information (name, surname, phone number, email address, and chosen appointment time) for the purpose of confirming and managing your appointment and sending you reminders.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4E4D50' }} />
            <p>
              Your payment will be processed securely by <strong>Ozow</strong> – we never receive or store your banking details.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4E4D50' }} />
            <p>
              Your information is stored securely on <strong>Google Firebase servers</strong> and will only be used for the purposes stated above.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4E4D50' }} />
            <p>
              We will keep your booking record for <strong>5 years</strong> and then permanently delete it.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#4E4D50' }} />
            <p>
              You may withdraw this consent or request to see/delete your data at any time by contacting our Information Officer: <strong>Dr. NS Taylor</strong> at{' '}
              <a href="mailto:privacy@drnstaylor.co.za" className="underline font-semibold" style={{ color: '#4E4D50' }}>
                privacy@drnstaylor.co.za
              </a>{' '}
              or{' '}
              <a href="tel:+27116792961" className="underline font-semibold" style={{ color: '#4E4D50' }}>
                011 679 2961
              </a>.
            </p>
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link 
            to="/privacy" 
            target="_blank"
            className="inline-flex items-center space-x-2 text-sm font-medium hover:underline"
            style={{ color: '#4E4D50' }}
          >
            <span>View our full Privacy Policy</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Acceptance Checkbox */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-2 border-gray-200 rounded-lg p-4 md:p-6"
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
                  ? 'border-transparent'
                  : 'bg-white border-gray-400 group-hover:border-gray-600'
              }`}
              style={accepted ? { backgroundColor: '#4E4D50' } : {}}
            >
              {accepted && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-medium text-gray-800">
              I have read and agree to the above <span className="text-red-500">*</span>
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              By checking this box, I consent to the collection and processing of my personal information as described above, in accordance with the Protection of Personal Information Act (POPIA).
            </p>
          </div>
        </label>
      </motion.div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm text-blue-800">
          <strong>Your privacy matters to us.</strong> We are committed to protecting your personal information in compliance with POPIA (Protection of Personal Information Act) of South Africa.
        </p>
      </div>
    </div>
  )
}

export default POPIAConsentStep

