import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const Contact = () => {
  const practices = [
    {
      name: 'Weltevreden Park',
      phone: '011 679 2961',
      emails: [
        { type: 'Admin', address: 'admin@dentaloffices.co.za' },
        { type: 'Accounts', address: 'accounts@dentaloffices.co.za' },
        { type: 'Enquiries', address: 'enquiries@dentaloffices.co.za' },
      ],
      address: 'The Gables Unit no.2\n879 Tennis Rd, Weltevreden Park Ext 25\n1709',
      regNo: '1995/0136',
      practiceNo: '5446899',
    },
    {
      name: 'Ruimsig',
      phone: '010 100 8410',
      emails: [
        { type: 'Admin', address: 'admin.ruimsig@dentaloffices.co.za' },
        { type: 'Accounts', address: 'accounts.ruimsig@dentaloffices.co.za' },
        { type: 'Enquiries', address: 'enquiries.ruimsig@dentaloffices.co.za' },
      ],
      address: 'Unit 5, Ruimsig Country Office Park\n129 Hole In One St, Ruimsig\n1724',
      regNo: 'TBC',
      practiceNo: 'TBC',
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
              Get in Touch
            </h1>
            <p className="text-lg text-gray-300">
              Contact either of our practices. We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Practice Contact Cards */}
      <section className="relative py-12 md:py-16 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {practices.map((practice, index) => (
              <motion.div
                key={practice.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg border-2 p-6 md:p-8"
                style={{ borderColor: '#4E4D50' }}
              >
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                  {practice.name}
                </h2>

                <div className="space-y-5">
                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                      <p className="text-gray-600">{practice.phone}</p>
                      <p className="text-sm text-gray-500">Mon-Fri: 8:00 AM - 4:30 PM</p>
                    </div>
                  </div>

                  {/* Emails */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                      <div className="space-y-1">
                        {practice.emails.map((email) => (
                          <div key={email.address} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">{email.type}:</span>
                            <a href={`mailto:${email.address}`} className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                              {email.address}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                      <p className="text-gray-600 whitespace-pre-line">{practice.address}</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <p>Monday - Friday: 8:00 AM - 4:30 PM</p>
                        <p>Saturday: 8:00 AM - 12:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Details */}
                  {practice.regNo && practice.practiceNo && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs uppercase font-medium">Reg No.</p>
                          <p className="text-gray-700 font-medium">{practice.regNo}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase font-medium">Practice No.</p>
                          <p className="text-gray-700 font-medium">{practice.practiceNo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Contact */}
      <section className="py-8 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <a
              href="https://wa.me/27798639823"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg p-5 transition-all hover:scale-[1.02] shadow-lg"
            >
              <WhatsAppIcon className="w-8 h-8" />
              <div className="text-left">
                <p className="text-sm font-medium opacity-90">Chat with us on WhatsApp</p>
                <p className="text-xl font-bold">+27 (79) 863-9823</p>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-8 pb-16 bg-white z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto bg-red-50 rounded-lg border-2 border-red-500 p-4 md:p-6"
          >
            <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-2 md:mb-3">Emergency Contact</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-3">
              For dental emergencies outside business hours, please call:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Weltevreden Park</p>
                <p className="text-lg font-bold text-gray-700">011 679 2961</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Ruimsig</p>
                <p className="text-lg font-bold text-gray-700">010 100 8410</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
