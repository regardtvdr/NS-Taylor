import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react'
import { AnimatedGridPattern } from '../components/ui/animated-grid-pattern'
import { cn } from '../lib/utils'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    practice: 'weltevreden',
  })
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '', practice: 'weltevreden' })
    }, 3000)
  }

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
                      <p className="text-sm text-gray-500">Mon-Fri: 8:00 AM - 5:00 PM</p>
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
                        <p>Saturday & Sunday: Closed</p>
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

      {/* Contact Form Section */}
      <section className="relative py-8 md:py-12 pb-16 md:pb-20 bg-gray-50 z-10 overflow-hidden">
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
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg border-2 p-6 md:p-8"
              style={{ borderColor: '#4E4D50' }}
            >
              <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6 text-center">
                Send us a Message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#4E4D50' }} />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    We'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Practice Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Which practice are you contacting? *
                    </label>
                    <select
                      required
                      value={formData.practice}
                      onChange={(e) => setFormData({ ...formData, practice: e.target.value })}
                      className="input-field bg-white"
                    >
                      <option value="weltevreden">Weltevreden Park</option>
                      <option value="ruimsig">Ruimsig</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field bg-white"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-field bg-white"
                        placeholder="011 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field bg-white"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="input-field bg-white resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#4E4D50' }}
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-red-50 rounded-lg border-2 border-red-500 p-4 md:p-6 mt-8"
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
        </div>
      </section>
    </div>
  )
}

export default Contact
