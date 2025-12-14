import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { SERVICES } from '../utils/constants'
import { 
  Stethoscope, 
  Sparkles, 
  Sun, 
  Activity, 
  Syringe, 
  AlertCircle 
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

// Modern container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// Modern card animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateX: -15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
}

// Title animation variants
const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(10px)",
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
      duration: 0.8,
    },
  },
}

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])

  // Smooth spring animations
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden"
    >
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
      
      <motion.div
        style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-12 lg:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 tracking-tight mb-3 md:mb-4"
            whileInView={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
            viewport={{ once: true }}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="section-subtitle max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Comprehensive dental care tailored to your needs
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
        >
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Activity
            
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  rotateX: 5,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                  }
                }}
                className="bg-gray-50 border-2 border-gray-900 rounded-lg p-4 md:p-6 group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  initial={false}
                />

                <div className="relative z-10">
                  <motion.div 
                    className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 border-2 border-gray-900 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gray-100 transition-colors duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-base md:text-lg font-semibold text-gray-800 mb-2 tracking-tight"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {service.name}
                  </motion.h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            delay: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/contact" className="inline-block">
              <InteractiveHoverButton 
                text="View All Services" 
                variant="primary"
                className="px-8 py-4 w-auto min-w-[240px]"
                as="div"
              />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Services
