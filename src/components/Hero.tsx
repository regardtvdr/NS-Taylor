import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Star } from 'lucide-react'

const Hero = () => {
  return (
    <section 
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden"
      aria-label="Welcome to Dr. NS Taylor and Associates dental practice"
      role="banner"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 100%)',
          }}
        />
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
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
            Dr. NS Taylor & Associates Inc.
            <br />
            <span className="text-gray-300 font-normal">Quality Dental Care</span>
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 max-w-3xl mx-auto font-light leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience world-class dental treatment with our state-of-the-art facilities
            and expert team. Contact us today to schedule your appointment.
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
              <Link 
                to="/contact" 
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 relative overflow-hidden group w-full sm:w-auto text-center block"
                aria-label="Contact Dr. NS Taylor and Associates dental practice"
              >
                <motion.div
                  className="absolute inset-0 bg-gray-100"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                />
                <span className="relative z-10">Contact Us</span>
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
                aria-label="Learn more about Dr. NS Taylor and Associates dental practice"
              >
                <motion.div
                  className="absolute inset-0 bg-gray-100"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                />
                <span className="relative z-10">Learn More About Us</span>
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
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">5-Star Rated</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden="true"
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

