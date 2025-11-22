import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Award, Users, Heart, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const { ref, isInView } = useScrollAnimation()

  const features = [
    {
      icon: Award,
      title: 'Award-Winning Practice',
      description: 'Recognized for excellence in dental care and patient satisfaction',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Highly qualified dentists and support staff with years of experience',
    },
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Your comfort and well-being are our top priorities',
    },
    {
      icon: Shield,
      title: 'Modern Technology',
      description: 'State-of-the-art equipment and latest dental techniques',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About Premium Dental
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              We are a premier dental practice in South Africa, dedicated to providing
              exceptional dental care with a focus on patient comfort and satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Premium Dental, we believe that everyone deserves access to world-class
                dental care. Our mission is to provide exceptional dental services in a
                comfortable, modern environment while making the booking process as simple
                and convenient as possible.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We've revolutionized the appointment booking experience with our innovative
                online platform, reducing no-shows by 42% and ensuring that every patient
                receives the care they need when they need it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={ref} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Why Choose Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="card p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-700 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Experience Premium Care?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Book your appointment today and join thousands of satisfied patients
            </p>
            <Link to="/booking" className="btn-primary bg-white text-gray-800 hover:bg-gray-100 inline-flex items-center space-x-2">
              <span>Book Appointment</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

