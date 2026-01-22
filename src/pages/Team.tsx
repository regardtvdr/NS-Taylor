import { motion } from 'framer-motion'
import { Award, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DENTISTS } from '../utils/constants'
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials'
import { InteractiveHoverButton } from '../components/ui/InteractiveHoverButton'
import { Button as MovingBorderButton } from '../components/ui/moving-border'
import { AnimatedGridPattern } from '../components/ui/animated-grid-pattern'
import { cn } from '../lib/utils'

const Team = () => {
  // Convert dentists to testimonials format for the animated component
  const dentistTestimonials = DENTISTS.map((dentist) => ({
    quote: dentist.bio || `Specializing in ${dentist.specialization}, dedicated to providing exceptional dental care.`,
    name: dentist.name,
    designation: `${dentist.specialization} • Ruimsig & Weltevreden Park`,
    src: '',
  }))

  const DentistCard = ({ dentist, index }: { dentist: typeof DENTISTS[0], index: number }) => (
    <motion.div
      key={dentist.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card p-8 hover:shadow-xl transition-shadow duration-300 border-2"
      style={{ borderColor: '#4E4D50' }}
    >
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          {dentist.avatar ? (
            <img
              src={dentist.avatar}
              alt={dentist.name}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
              loading="lazy"
              width="128"
              height="128"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto border-4 border-gray-200">
              <span className="text-4xl font-bold text-gray-600">
                {dentist.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 rounded-full p-2 border-4 border-white" style={{ backgroundColor: '#4E4D50' }}>
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">
          {dentist.name}
        </h3>
        <p className="text-gray-600 font-medium mb-4">
          {dentist.specialization}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3 text-gray-700">
          <GraduationCap className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">{dentist.qualifications}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {dentist.bio}
      </p>

      <Link to="/contact" className="inline-block w-full">
        <InteractiveHoverButton 
          text={`Contact to Book`}
          variant="primary"
          className="w-full"
          as="div"
        />
      </Link>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#434448' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Meet Our Expert Team
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Our experienced dental professionals across both practices are dedicated to providing you with the highest quality care and personalized treatment.
            </p>
            <Link to="/contact" className="inline-block">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-auto min-w-[220px]"
                className="px-8 bg-white text-gray-800 border-gray-200 text-lg"
                as="div"
              >
                Contact Us
              </MovingBorderButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Testimonials Section */}
      <section className="py-16 bg-white relative overflow-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Our Dental Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get to know the talented team members who will care for your smile
            </p>
          </motion.div>
          <AnimatedTestimonials testimonials={dentistTestimonials} />
        </div>
      </section>

      {/* Our Dental Professionals - Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Our Dental Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our dentists practice at both our Ruimsig and Weltevreden Park locations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {DENTISTS.map((dentist, index) => (
              <DentistCard key={dentist.id} dentist={dentist} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{ backgroundColor: '#434448' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-display font-bold mb-6">
              Ready to Meet Your Perfect Dentist?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Contact us to schedule an appointment with one of our expert dental professionals today. 
              Experience personalized care in a comfortable, modern environment.
            </p>
            <Link to="/contact" className="inline-block">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-auto min-w-[200px]"
                className="px-8 bg-white text-gray-800 border-gray-200"
                as="div"
              >
                Contact Us
              </MovingBorderButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Team
