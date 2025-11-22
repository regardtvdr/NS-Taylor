import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Check } from 'lucide-react'
import { DEPOSIT_AMOUNT } from '../../utils/constants'

interface PaymentStepProps {
  selectedMethod: 'ozow' | 'payfast' | null
  onSelect: (method: 'ozow' | 'payfast') => void
  servicePrice: number
}

const PaymentStep = ({ selectedMethod, onSelect, servicePrice }: PaymentStepProps) => {
  const [cardFlipped, setCardFlipped] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Secure Payment
        </h2>
        <p className="text-sm text-gray-500">Pay your R{DEPOSIT_AMOUNT} deposit to secure your appointment</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Service Total</span>
          <span className="text-xl font-bold text-gray-900">R{servicePrice}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <span className="text-gray-600">Deposit Required</span>
            <p className="text-sm text-gray-700 font-medium">Secures your appointment</p>
          </div>
          <span className="text-2xl font-bold text-gray-800">R{DEPOSIT_AMOUNT}</span>
          </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Balance Due</span>
          <span className="text-lg font-semibold text-gray-900">
            R{servicePrice - DEPOSIT_AMOUNT}
          </span>
        </div>
        <div className="mt-4 p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600">
            <Check className="w-4 h-4 inline mr-2 text-gray-700" />
            Pay the remaining balance on the day of your appointment
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="font-semibold text-navy-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ozow */}
          <motion.button
            onClick={() => onSelect('ozow')}
            className={`relative p-6 rounded-lg border transition-all duration-300 ${
              selectedMethod === 'ozow'
                ? 'border-gray-600 bg-gray-50 scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedMethod === 'ozow' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            <div className="text-2xl font-bold text-gray-900 mb-2">Ozow</div>
            <p className="text-sm text-gray-600">Instant EFT, Credit Card, Debit Card</p>
          </motion.button>

          {/* PayFast */}
          <motion.button
            onClick={() => onSelect('payfast')}
            className={`relative p-6 rounded-lg border transition-all duration-300 ${
              selectedMethod === 'payfast'
                ? 'border-gray-600 bg-gray-50 scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedMethod === 'payfast' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            <div className="text-2xl font-bold text-gray-900 mb-2">PayFast</div>
            <p className="text-sm text-gray-600">Credit Card, Debit Card, EFT</p>
          </motion.button>
        </div>
      </div>

      {/* 3D Card Preview */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div style={{ perspective: '1000px' }}>
            <motion.div
              className="relative w-full h-48"
              onHoverStart={() => setCardFlipped(true)}
              onHoverEnd={() => setCardFlipped(false)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-card p-6 text-white"
                animate={{
                  rotateY: cardFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="flex items-center justify-between mb-8">
                  <Shield className="w-8 h-8" />
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-xl font-mono mb-4">•••• •••• •••• 4242</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-300 mb-1">CARDHOLDER</div>
                    <div className="text-sm">JOHN DOE</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-300 mb-1">EXPIRES</div>
                    <div className="text-sm">12/25</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-gray-700" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="w-4 h-4 text-gray-700" />
          <span>No Credit Card Required</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-gray-700" />
          <span>Instant Confirmation</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentStep

