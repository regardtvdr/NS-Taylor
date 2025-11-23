import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react'

const Location = () => {
  const { ref, isInView } = useScrollAnimation()

  // Sandton, Johannesburg coordinates (example location)
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.1234567890!2d28.0544!3d-26.1076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA2JzI3LjQiUyAyOMKwMDMnMTUuOCJF!5e0!3m2!1sen!2sza!4v1234567890123!5m2!1sen!2sza"

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-800 z-10 -mt-20 md:-mt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 pt-32 md:pt-40">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-white">
              Visit Our Practice
            </h1>
            <p className="text-lg text-gray-300">
              Located in the heart of Sandton, Johannesburg
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-8 md:py-12 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-lg overflow-hidden shadow-md border border-gray-200"
              >
                <div className="aspect-video w-full">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="Premium Dental Practice Location"
                  />
                </div>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg border-2 border-gray-800 p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <div>
                  <h2 className="text-lg md:text-xl font-display font-semibold text-gray-800 mb-3 md:mb-4 tracking-tight">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-4 md:space-y-5">
                  {/* Address */}
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        123 Medical Boulevard<br />
                        Sandton, Johannesburg 2196<br />
                        South Africa
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-sm text-gray-600">+27 11 123 4567</p>
                      <p className="text-xs text-gray-500 mt-0.5">Mon-Fri: 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-sm text-gray-600">info@premiumdental.co.za</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                        <p>Saturday: 9:00 AM - 1:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Directions Button */}
                <div className="pt-4 border-t border-gray-100">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Sandton+Johannesburg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative py-8 md:py-12 pb-16 md:pb-20 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4 md:mb-6 text-center tracking-tight">
              Getting Here
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white rounded-lg border-2 border-gray-800 p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  By Car
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We're located on Medical Boulevard, with easy access from the N1 and M1 highways. 
                  Free parking is available on-site for all patients.
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-gray-800 p-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  Public Transport
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The practice is easily accessible via the Gautrain Sandton Station, 
                  located just 5 minutes walk away. Multiple bus routes also serve the area.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Location

