import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Clock, Star } from 'lucide-react'
import { DEPOSIT_AMOUNT } from '../utils/constants'
import { InteractiveHoverButton } from './ui/InteractiveHoverButton'

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1920&q=75&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Premium Dental Care
            <br />
            <span className="text-gray-300 font-normal">In South Africa</span>
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 max-w-3xl mx-auto font-light leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience world-class dental treatment with our state-of-the-art facilities
            and expert team. Book your appointment in minutes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 md:mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto"
            >
              <Link to="/booking" className="inline-block w-full sm:w-auto">
                <InteractiveHoverButton 
                  text="Book Appointment" 
                  variant="primary"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-w-[200px]"
                  as="div"
                />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto"
            >
              <Link 
                to="/about" 
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 relative overflow-hidden group w-full sm:w-auto text-center block"
              >
                <motion.div
                  className="absolute inset-0 bg-gray-100"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Learn More</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-white/90 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">R{DEPOSIT_AMOUNT} Deposit</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">5-Star Rated</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero

