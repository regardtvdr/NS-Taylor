import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react'

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: [
        'Personal information such as name, email address, phone number, and ID number',
        'Appointment booking details and preferences (including recurring appointment settings)',
        'Medical history and dental records (when provided)',
        'Website usage data and analytics',
        'Communication preferences and consent records',
        'Cancellation policy acceptance records',
      ],
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'To process and manage your appointments and dental care (including recurring appointments)',
        'To send appointment reminders via SMS, WhatsApp, or email',
        'To communicate with you about your dental care and treatment',
        'To manage billing and payment records (payment is processed on the day of your appointment)',
        'To maintain accurate medical records as required by law',
        'To track cancellation policy acceptance and manage cancellation requests',
        'To improve our services and user experience',
        'To comply with legal and regulatory requirements',
        'To respond to your inquiries and provide customer support',
      ],
    },
    {
      icon: Eye,
      title: 'Data Security & Protection',
      content: [
        'We use industry-standard SSL encryption to protect your data in transit',
        'Your personal information is stored securely and accessed only by authorized personnel',
        'Payment information is processed securely on-site on the day of your appointment',
        'We implement access controls and authentication measures',
        'We regularly review and update our security measures',
        'All staff members are trained on data protection and confidentiality',
        'We maintain backup systems and disaster recovery procedures',
        'We protect your appointment history and patient records with appropriate security measures',
      ],
    },
    {
      icon: FileText,
      title: 'Your Rights Under POPIA',
      content: [
        'Right to access: You can request access to your personal information we hold',
        'Right to correction: You can request corrections to inaccurate or incomplete data',
        'Right to deletion: You may request deletion of your data (subject to legal retention requirements)',
        'Right to object: You can object to processing of your personal information',
        'Right to restrict processing: You can request restriction of how we process your data',
        'Right to data portability: You can request your data in a structured, commonly used format',
        'Right to withdraw consent: You can withdraw consent for processing at any time',
        'Right to lodge a complaint: You can lodge a complaint with the Information Regulator',
      ],
    },
    {
      icon: Scale,
      title: 'POPIA Compliance',
      content: [
        'We are registered as a responsible party under the Protection of Personal Information Act (POPIA)',
        'We process personal information lawfully, fairly, and transparently',
        'We collect only information necessary for the specified purpose',
        'We maintain accurate and up-to-date information',
        'We retain information only for as long as necessary or as required by law',
        'We implement appropriate technical and organizational measures to protect personal information',
        'We have appointed an Information Officer responsible for POPIA compliance',
        'We conduct regular privacy impact assessments',
      ],
    },
    {
      icon: AlertCircle,
      title: 'Consumer Protection Act (CPA) Compliance',
      content: [
        'We provide clear and transparent information about our services and pricing',
        'All terms and conditions are disclosed before booking',
        'You have the right to cancel appointments subject to our cancellation policy',
        'We provide fair and reasonable cancellation and refund policies',
        'We do not engage in unfair, unreasonable, or unjust contract terms',
        'We honor all advertised services and pricing',
        'We provide clear information about deposits and payment terms',
        'You have the right to file complaints with the National Consumer Commission',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Electronic Communications and Transactions Act (ECTA)',
      content: [
        'We comply with ECTA requirements for electronic transactions',
        'All electronic communications are legally binding when properly authenticated',
        'We maintain records of all electronic transactions as required by law',
        'We use secure electronic signatures and authentication methods',
        'We protect the integrity of electronic communications',
        'We provide clear information about the legal effect of electronic transactions',
        'We maintain audit trails of all electronic transactions',
        'We comply with data retention requirements under ECTA',
      ],
    },
    {
      icon: Lock,
      title: 'Data Sharing & Third Parties',
      content: [
        'We do not sell your personal information to third parties',
        'We may share information with service providers who assist in our operations (under strict confidentiality agreements)',
        'We may disclose information if required by law or court order',
        'We may share information with healthcare providers involved in your treatment',
        'We may share information with medical aid schemes for billing purposes (with your consent)',
        'All third parties are contractually bound to protect your information',
        'We do not transfer personal information outside South Africa without appropriate safeguards',
      ],
    },
    {
      icon: FileText,
      title: 'Data Retention',
      content: [
        'We retain appointment records for a minimum of 5 years as required by healthcare regulations',
        'Financial records are retained for 5 years as required by tax legislation',
        'Medical records may be retained longer for continuity of care',
        'Marketing consent records are retained until you withdraw consent',
        'We securely delete or anonymize data when retention periods expire',
        'You can request information about our data retention periods',
      ],
    },
  ]

  return (
    <div className="min-h-screen py-12 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Last updated: {new Date().toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-500">
            Compliant with POPIA, CPA, and ECTA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 md:p-12 mb-8"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Premium Dental Practice, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you use our
            booking platform and services, in compliance with South African legislation including
            the Protection of Personal Information Act (POPIA), Consumer Protection Act (CPA),
            and Electronic Communications and Transactions Act (ECTA).
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Legal Basis:</strong> We process your personal information based on your consent,
              contractual necessity (providing dental services), legal obligations (healthcare record keeping),
              and legitimate interests (improving our services).
            </p>
          </div>
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
            Contact Our Information Officer
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, wish to exercise your rights under POPIA,
            or have concerns about how we handle your personal information, please contact our Information Officer:
          </p>
          <div className="space-y-2 text-gray-700 mb-6">
            <p>
              <strong>Email:</strong> privacy@premiumdental.co.za
            </p>
            <p>
              <strong>Phone:</strong> +27 11 123 4567
            </p>
            <p>
              <strong>Address:</strong> 123 Medical Boulevard, Sandton, Johannesburg 2196, South Africa
            </p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Right to Complain:</strong> If you are not satisfied with how we handle your personal information,
              you have the right to lodge a complaint with the Information Regulator of South Africa at
              <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                www.justice.gov.za/inforeg/
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-8 mt-8 bg-blue-50 border border-blue-200"
        >
          <h2 className="text-xl font-display font-bold text-gray-800 mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 text-sm">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
            We will notify you of any material changes by posting the updated policy on our website and updating the
            "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
