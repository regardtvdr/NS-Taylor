import { motion } from 'framer-motion'
import { Award, Users, Heart, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from '../components/ui/InteractiveHoverButton'
import { AnimatedGridPattern } from '../components/ui/animated-grid-pattern'
import { cn } from '../lib/utils'

const About = () => {
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
      <section className="relative py-20 text-white" style={{ backgroundColor: '#434448' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About Dr. NS Taylor & Associates Inc.
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              A family-oriented dental practice dedicated to providing compassionate, 
              comprehensive dental care for patients of all ages.
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
                About Us
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                DR NS Taylor & Associates Inc. is a family-oriented dental practice dedicated to providing 
                compassionate, comprehensive dental care for patients of all ages. We offer a full range of 
                services, from routine cleanings and exams to advanced procedures, including removable and 
                fixed prosthodontic treatments - all in one convenient and safe location.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our experienced team is committed to creating a comfortable, welcoming environment where 
                families feel at ease. Your smile is our priority!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="card p-6 text-center border-2"
                  style={{ borderColor: '#4E4D50' }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#4E4D50' }}>
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
      <section className="py-20 text-white" style={{ backgroundColor: '#434448' }}>
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
              Contact us today to schedule your appointment and join thousands of satisfied patients
            </p>
            <Link to="/contact" className="inline-block">
              <InteractiveHoverButton 
                text="Contact Us" 
                variant="secondary"
                className="px-8 py-4 w-auto min-w-[200px]"
                as="div"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

