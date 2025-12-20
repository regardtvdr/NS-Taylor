import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Clock, CheckCircle } from 'lucide-react'
import { Button as MovingBorderButton } from './ui/moving-border'

const CTA = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 relative overflow-hidden" style={{ backgroundColor: '#434448' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 tracking-tight px-2">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 md:mb-12 font-light leading-relaxed max-w-3xl mx-auto px-4">
            Contact us today to schedule your appointment and experience premium dental care.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20"
            >
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-gray-300 mx-auto mb-2 md:mb-3" />
              <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm text-white">SSL Secured</h3>
              <p className="text-xs text-gray-200">Your data is protected</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20"
            >
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-gray-300 mx-auto mb-2 md:mb-3" />
              <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm text-white">Expert Care</h3>
              <p className="text-xs text-gray-200">Experienced professionals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20"
            >
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-300 mx-auto mb-2 md:mb-3" />
              <h3 className="font-semibold mb-1 md:mb-2 text-xs md:text-sm text-white">Quality Care</h3>
              <p className="text-xs text-gray-200">Patient-centered approach</p>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/contact" className="inline-block w-full sm:w-auto">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-full sm:w-auto min-w-[280px]"
                className="px-8 bg-white text-gray-800 border-gray-200 text-base sm:text-lg"
                as="div"
              >
                Contact Us Today
              </MovingBorderButton>
            </Link>
          </motion.div>

          <p className="mt-4 md:mt-6 text-xs sm:text-sm text-gray-300 px-4">
            Call us at 011 679 2961 (Weltevreden Park) or 010 100 8410 (Ruimsig)
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA

