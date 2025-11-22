import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Clock, CheckCircle } from 'lucide-react'
import { DEPOSIT_AMOUNT } from '../utils/constants'
import { InteractiveHoverButton } from './ui/InteractiveHoverButton'

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
            Book your appointment today and experience premium dental care.
            Secure your slot with just a R{DEPOSIT_AMOUNT} deposit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <Shield className="w-6 h-6 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-sm">SSL Secured</h3>
              <p className="text-xs text-gray-200">Your data is protected</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <Clock className="w-6 h-6 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-sm">Quick Booking</h3>
              <p className="text-xs text-gray-200">Book in under 2 minutes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <CheckCircle className="w-6 h-6 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold mb-2 text-sm">42% Fewer No-Shows</h3>
              <p className="text-xs text-gray-200">Deposit system works</p>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/booking" className="inline-block">
              <InteractiveHoverButton 
                text="Book Your Appointment Now" 
                variant="secondary"
                className="px-8 py-4 w-auto min-w-[280px] bg-white text-gray-800 border-white"
                as="div"
              />
            </Link>
          </motion.div>

          <p className="mt-6 text-sm text-gray-300">
            No credit card required • Instant confirmation • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA

