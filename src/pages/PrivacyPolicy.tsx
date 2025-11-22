import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        'Personal information such as name, email address, phone number, and ID number',
        'Appointment booking details and preferences',
        'Payment information processed through secure third-party providers',
        'Website usage data and analytics',
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To process and manage your appointments',
        'To send appointment reminders via SMS, WhatsApp, or email',
        'To communicate with you about your dental care',
        'To improve our services and user experience',
        'To comply with legal and regulatory requirements',
      ],
    },
    {
      icon: Eye,
      title: 'Data Security',
      content: [
        'We use industry-standard SSL encryption to protect your data',
        'All payment transactions are processed through secure, PCI-compliant providers',
        'Your personal information is stored securely and accessed only by authorized personnel',
        'We regularly review and update our security measures',
      ],
    },
    {
      icon: FileText,
      title: 'Your Rights',
      content: [
        'You have the right to access your personal information',
        'You can request corrections to inaccurate data',
        'You may request deletion of your data (subject to legal requirements)',
        'You can opt-out of marketing communications at any time',
        'You have the right to data portability',
      ],
    },
  ]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 md:p-12 mb-8"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Premium Dental, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you use our
            booking platform and services.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card p-8"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-gray-800">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3 ml-16">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <span className="text-gray-600 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-8 mt-8 bg-gradient-to-br bg-gray-50 border border-gray-200"
        >
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your
            rights, please contact us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong> privacy@premiumdental.co.za
            </p>
            <p>
              <strong>Phone:</strong> +27 11 123 4567
            </p>
            <p>
              <strong>Address:</strong> 123 Medical Boulevard, Sandton, Johannesburg 2196
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

