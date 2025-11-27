import { motion } from 'framer-motion'
import { Shield, Lock, Check, Banknote, CreditCard } from 'lucide-react'
import { DEPOSIT_AMOUNT } from '../../utils/constants'

interface PaymentStepProps {
  selectedMethod: 'ozow' | 'instant-eft' | null
  onSelect: (method: 'ozow' | 'instant-eft') => void
  servicePrice: number
}

const PaymentStep = ({ selectedMethod, onSelect, servicePrice }: PaymentStepProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Secure Payment
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Pay your R{DEPOSIT_AMOUNT} deposit to secure your appointment</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border-2" style={{ borderColor: '#4E4D50' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Service Total</span>
          <span className="text-xl font-bold text-gray-900">R{servicePrice}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <span className="text-gray-600">Deposit Required</span>
            <p className="text-sm font-medium" style={{ color: '#4E4D50' }}>Secures your appointment</p>
          </div>
          <span className="text-2xl font-bold" style={{ color: '#4E4D50' }}>R{DEPOSIT_AMOUNT}</span>
          </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Balance Due at Appointment</span>
          <span className="text-lg font-semibold text-gray-900">
            R{servicePrice - DEPOSIT_AMOUNT}
          </span>
        </div>
        <div className="mt-4 p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600">
            <Check className="w-4 h-4 inline mr-2" style={{ color: '#4E4D50' }} />
            Pay the remaining balance on the day of your appointment
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Ozow */}
          <motion.button
            onClick={() => onSelect('ozow')}
            className={`relative p-4 md:p-6 rounded-lg border-2 transition-all duration-300 text-left ${
              selectedMethod === 'ozow'
                ? 'bg-gray-50 scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
            style={selectedMethod === 'ozow' ? { borderColor: '#4E4D50' } : {}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedMethod === 'ozow' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4E4D50' }}
              >
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </motion.div>
            )}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4E4D50' }}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">Ozow</div>
            </div>
            <p className="text-xs md:text-sm text-gray-600">Pay securely with Ozow - supports all major banks</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Credit Card</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Debit Card</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">EFT</span>
            </div>
          </motion.button>

          {/* Instant EFT */}
          <motion.button
            onClick={() => onSelect('instant-eft')}
            className={`relative p-4 md:p-6 rounded-lg border-2 transition-all duration-300 text-left ${
              selectedMethod === 'instant-eft'
                ? 'bg-gray-50 scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
            style={selectedMethod === 'instant-eft' ? { borderColor: '#4E4D50' } : {}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedMethod === 'instant-eft' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4E4D50' }}
              >
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </motion.div>
            )}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4E4D50' }}>
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900">Instant EFT</div>
            </div>
            <p className="text-xs md:text-sm text-gray-600">Direct bank transfer - instant confirmation</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">FNB</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Standard Bank</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">ABSA</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Nedbank</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Capitec</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Selected Payment Info */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-gray-200 bg-white"
        >
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5" style={{ color: '#4E4D50' }} />
            <p className="text-sm text-gray-700">
              {selectedMethod === 'ozow' 
                ? 'You will be redirected to Ozow to complete your R50 payment securely.'
                : 'You will be redirected to complete your R50 instant EFT payment.'
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 pt-4 md:pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm text-gray-600">
          <Shield className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" style={{ color: '#4E4D50' }} />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm text-gray-600">
          <Lock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" style={{ color: '#4E4D50' }} />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm text-gray-600">
          <Check className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" style={{ color: '#4E4D50' }} />
          <span>Instant Confirmation</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentStep

