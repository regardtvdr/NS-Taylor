import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SERVICES } from '../utils/constants'
import { 
  Stethoscope, 
  Sparkles, 
  Sun, 
  Activity, 
  Syringe, 
  AlertCircle,
  Clock,
  ArrowRight 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from './ui/InteractiveHoverButton'
import { AnimatedGridPattern } from './ui/animated-grid-pattern'
import { cn } from '../lib/utils'

const iconMap: Record<string, any> = {
  stethoscope: Stethoscope,
  sparkles: Sparkles,
  sun: Sun,
  tooth: Activity,
  syringe: Syringe,
  'alert-circle': AlertCircle,
}

const Services = () => {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.6}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 tracking-tight mb-3 md:mb-4">
            Our Services
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Comprehensive dental care tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon] || Activity
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white border-2 border-gray-900 rounded-lg p-4 md:p-6 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 border-2 border-gray-900 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gray-100 transition-colors duration-300">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 tracking-tight">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="text-gray-700 font-semibold">
                      R{service.price}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/booking" className="inline-block">
              <InteractiveHoverButton 
                text="View All Services & Book" 
                variant="primary"
                className="px-8 py-4 w-auto min-w-[240px]"
                as="div"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services

