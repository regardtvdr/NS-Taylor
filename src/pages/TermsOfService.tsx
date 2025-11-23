import { motion } from 'framer-motion'
import { FileText, AlertCircle, CheckCircle, Scale, CreditCard, Calendar, XCircle } from 'lucide-react'

const TermsOfService = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using the Premium Dental Practice website and booking platform, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'These terms apply to all users of the website, including patients, visitors, and staff members.',
        'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of modified terms.',
      ],
    },
    {
      icon: Calendar,
      title: 'Appointment Booking Terms',
      content: [
        'Appointments are subject to availability and confirmation by our practice.',
        'No deposit is required to book an appointment - payment is made on the day of your visit.',
        'You must provide accurate and complete information when booking appointments.',
        'You must accept our cancellation policy during the booking process to complete your appointment.',
        'We reserve the right to refuse or cancel appointments if information provided is false or incomplete.',
        'Appointment times are estimates and may vary based on treatment requirements.',
        'You can book recurring appointments (daily, weekly, monthly, or yearly) for regular treatments.',
        'Recurring appointments can be managed individually - you can cancel or reschedule single instances.',
      ],
    },
    {
      icon: XCircle,
      title: 'Cancellation and Billing Policy',
      content: [
        'All cancellations must be made at least 1 hour before your scheduled appointment time.',
        'If you cancel less than 1 hour before your appointment or fail to show up, you will be billed for the appointment.',
        'This policy is clearly disclosed during the booking process and must be accepted before completing your booking.',
        'You can cancel using the cancellation link in your confirmation email or by calling us at +27 11 123 4567.',
        'For recurring appointments, you can cancel individual appointments or the entire series, subject to the same 1-hour notice requirement.',
        'We reserve the right to cancel appointments due to unforeseen circumstances, in which case you will not be charged.',
        'Repeated late cancellations or no-shows may result in restrictions on future bookings.',
        'This policy helps us manage our schedule effectively and ensures we can serve all our patients efficiently.',
      ],
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      content: [
        'Payment for services is due on the day of your appointment.',
        'No deposit or upfront payment is required when booking - you pay when you visit.',
        'We accept cash, credit cards, debit cards, and medical aid payments (where applicable).',
        'All prices are in South African Rand (ZAR) and include VAT where applicable.',
        'We reserve the right to change our pricing at any time, but confirmed bookings will be honored at the booked price.',
        'Outstanding balances must be settled before subsequent appointments can be booked.',
        'For recurring appointments, payment is due on the day of each individual appointment.',
        'Medical aid claims are processed on-site, subject to your medical aid scheme\'s terms and conditions.',
      ],
    },
    {
      icon: AlertCircle,
      title: 'Service Limitations and Disclaimers',
      content: [
        'While we strive to provide accurate information on our website, we do not guarantee the completeness or accuracy of all information.',
        'Dental treatment outcomes may vary based on individual circumstances.',
        'We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.',
        'Our liability is limited to the amount paid for the specific service in question.',
        'We do not guarantee that our website will be available at all times or free from errors.',
        'We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.',
      ],
    },
    {
      icon: CheckCircle,
      title: 'User Responsibilities',
      content: [
        'You are responsible for maintaining the confidentiality of your account information.',
        'You must provide accurate, current, and complete information when using our services.',
        'You must not use our services for any illegal or unauthorized purpose.',
        'You must not attempt to gain unauthorized access to our systems or interfere with our services.',
        'You are responsible for all activities that occur under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
      ],
    },
    {
      icon: Scale,
      title: 'Consumer Protection Act (CPA) Rights',
      content: [
        'You have the right to receive services that are of good quality and fit for their intended purpose.',
        'You have the right to fair, just, and reasonable contract terms.',
        'You have the right to cancel services within the cooling-off period where applicable.',
        'You have the right to receive clear information about services, pricing, and terms.',
        'You have the right to file complaints with the National Consumer Commission if you believe your rights have been violated.',
        'We comply with all CPA requirements for fair business practices.',
      ],
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: [
        'All content on this website, including text, graphics, logos, and images, is the property of Premium Dental Practice.',
        'You may not reproduce, distribute, or use our content without prior written permission.',
        'The website design and booking platform are proprietary and protected by copyright.',
        'You may not use our trademarks or branding without authorization.',
      ],
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: [
        'To the maximum extent permitted by law, Premium Dental Practice shall not be liable for any direct, indirect, incidental, special, or consequential damages.',
        'Our total liability for any claims arising from these terms or our services shall not exceed the amount you paid for the specific service.',
        'We are not liable for any loss or damage resulting from your failure to comply with these terms.',
        'We are not responsible for any third-party services or websites linked from our platform.',
        'These limitations do not affect your statutory rights under South African law.',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Governing Law and Dispute Resolution',
      content: [
        'These Terms of Service are governed by the laws of the Republic of South Africa.',
        'Any disputes arising from these terms or our services will be subject to the exclusive jurisdiction of South African courts.',
        'We encourage resolution of disputes through direct communication with our practice.',
        'If a dispute cannot be resolved directly, you may seek resolution through the National Consumer Commission or appropriate legal channels.',
        'We are committed to fair and transparent dispute resolution processes.',
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
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Last updated: {new Date().toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-500">
            Please read these terms carefully before using our services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 md:p-12 mb-8"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to Premium Dental Practice. These Terms of Service ("Terms") govern your use of our
            website, booking platform, and dental services. By accessing or using our services, you agree
            to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> These terms are compliant with South African legislation including
              the Consumer Protection Act (CPA) and Electronic Communications and Transactions Act (ECTA).
              Your use of our services is subject to South African law.
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
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-gray-700 mb-6">
            <p>
              <strong>Email:</strong> info@premiumdental.co.za
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
              <strong>Consumer Complaints:</strong> If you have a complaint about our services, you may contact
              the National Consumer Commission at{' '}
              <a href="https://www.thencc.gov.za/" target="_blank" rel="noopener noreferrer" className="underline">
                www.thencc.gov.za
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
            Changes to Terms
          </h2>
          <p className="text-gray-700 text-sm">
            We reserve the right to modify these Terms of Service at any time. We will notify users of
            any material changes by posting the updated terms on our website and updating the "Last updated" date.
            Your continued use of our services after such changes constitutes acceptance of the modified terms.
            If you do not agree to the modified terms, you must discontinue use of our services.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService

