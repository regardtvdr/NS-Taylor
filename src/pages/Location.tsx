import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'

const Location = () => {
  const locations = [
    {
      name: 'Ruimsig',
      address: 'Unit 5, Ruimsig Country Office Park',
      street: '129 Hole In One St, Ruimsig',
      postalCode: '1724',
      phone: '010 100 8410',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6426.050403646808!2d27.8469630138852!3d-26.06941680072393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e959c1df954ffd5%3A0xf7ec8f21ad3ad17b!2sRuimsig%20Country%20Office%20Park!5e1!3m2!1sen!2sza!4v1765577948362!5m2!1sen!2sza',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ruimsig+Country+Office+Park+129+Hole+In+One+St+Ruimsig',
    },
    {
      name: 'Weltevreden Park',
      address: 'The Gables Unit no.2',
      street: '879 Tennis Rd, Weltevreden Park Ext 25',
      postalCode: '1709',
      phone: '011 679 2961',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4411.802853736976!2d27.922803296789553!3d-26.142136299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950b082c07a0c5%3A0x16f349b73fe22bec!2sGables%20Office%20Estate!5e1!3m2!1sen!2sza!4v1765578022166!5m2!1sen!2sza',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Gables+879+Tennis+Rd+Weltevreden+Park',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative z-10 -mt-20 md:-mt-24" style={{ backgroundColor: '#434448' }}>
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
              Visit Our Practices
            </h1>
            <p className="text-lg text-gray-300">
              Two convenient locations to serve you better
            </p>
          </motion.div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="relative py-12 md:py-16 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg border-2 overflow-hidden"
                style={{ borderColor: '#4E4D50' }}
              >
                {/* Map */}
                <div className="aspect-video w-full">
                  <iframe
                    src={location.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title={`${location.name} Location`}
                  />
                </div>

                {/* Location Details */}
                <div className="p-6 space-y-4">
                  <h2 className="text-2xl font-display font-bold text-gray-800">
                    {location.name}
                  </h2>

                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {location.address}<br />
                        {location.street}<br />
                        {location.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-sm text-gray-600">{location.phone}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>Monday - Friday: 8:00 AM - 4:30 PM</p>
                        <p>Saturday & Sunday: Closed</p>
                      </div>
                    </div>
                  </div>

                  {/* Directions Button */}
                  <div className="pt-4">
                    <a
                      href={location.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 text-sm py-3 px-6 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                      style={{ backgroundColor: '#4E4D50' }}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Directions to {location.name}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* General Info Section */}
      <section className="relative py-8 md:py-12 pb-16 md:pb-20 bg-gray-50 z-10">
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
              <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#4E4D50' }}>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  By Car
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Both our practices have easy access from major routes. 
                  Free parking is available on-site at both locations for all patients.
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 p-6" style={{ borderColor: '#4E4D50' }}>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  Contact Us
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Not sure which location is best for you? Contact us and we'll help you 
                  find the most convenient practice for your needs.
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
