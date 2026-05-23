import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Sparkles,
  Palette,
  ShieldCheck,
  Heart,
  CheckCircle,
  Sun,
  Smile,
  Gem,
  MapPin,
  Users,
  Zap,
  Activity,
  ClipboardList,
} from 'lucide-react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import GoogleReviews from '../components/GoogleReviews'
import CTA from '../components/CTA'
import { Button as MovingBorderButton } from '../components/ui/moving-border'

const Home = () => {
  return (
    <>
      <Hero />

      {/* Roodepoort landing – Section 1 */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Quality Dental Services at Dr. NS Taylor &amp; Associates Inc.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
              Whether you need a routine dental check-up, cosmetic dentistry, emergency dental
              treatment, or restorative procedures, our practice offers modern solutions tailored
              to your needs. If you are searching for a trusted dentist Roodepoort residents
              recommend, Dr. NS Taylor &amp; Associates Inc. is here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-5">
                Comprehensive Dental Care in Ruimsig and Weltevreden Park
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our dental practice proudly serves patients across Roodepoort, Ruimsig,
                Weltevreden Park, and surrounding areas. We understand how important it is to
                have a dependable dentist near you, which is why we focus on providing accessible,
                professional dental care with personalised attention.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { icon: Stethoscope, label: 'Dental examinations and oral assessments' },
                { icon: Sparkles, label: 'Professional teeth cleaning' },
                { icon: Palette, label: 'Fillings and cavity treatment' },
                { icon: ShieldCheck, label: 'Gum disease prevention and treatment' },
                { icon: Activity, label: 'Root canal therapy' },
                { icon: ClipboardList, label: 'Tooth extractions' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-start gap-3 rounded-xl border-2 p-4"
                  style={{ borderColor: '#4E4D50' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#4E4D50' }}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-snug">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 md:p-8 text-white"
              style={{ backgroundColor: '#434448' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold">General Dentistry Services</h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-4">
                Preventative dental care is essential for maintaining healthy teeth and gums. Our
                general dentistry services cover examinations, cleanings, fillings, gum care, root
                canal therapy, and extractions—all delivered with patient-focused care.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Regular dental visits can help detect oral health issues early and prevent more
                serious problems from developing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-2xl border-2 p-6 md:p-8"
              style={{ borderColor: '#4E4D50' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#4E4D50' }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800">
                  Cosmetic Dentistry for a Confident Smile
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                A healthy smile can improve your confidence and overall appearance. We offer
                cosmetic dental treatments designed to enhance your smile safely and
                effectively—including whitening, smile makeovers, crowns, veneers, and restorative
                solutions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you are looking for a cosmetic dentist Roodepoort patients trust, our team is
                ready to help you achieve a brighter, healthier smile.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our experienced dental team is committed to helping patients of all ages receive
              quality treatment in a welcoming environment.
            </p>
            <Link to="/contact" className="inline-block">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-auto min-w-[240px]"
                className="px-8 bg-white text-gray-800 border-gray-200 text-base"
                as="div"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Book Your Appointment Today
              </MovingBorderButton>
            </Link>
          </motion.div>
        </div>
      </section>

      <Services />

      {/* Cosmetic dentistry – Section 2 */}
      <section className="py-16 md:py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Cosmetic Dentistry for a Confident Smile
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              At Dr. NS Taylor &amp; Associates Inc., we offer cosmetic dental treatments designed
              to enhance your smile safely and effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
            {[
              {
                icon: Sun,
                title: 'Teeth Whitening',
                text: 'Professional teeth whitening to brighten your smile with safe, effective treatments tailored to your needs.',
              },
              {
                icon: Sparkles,
                title: 'Smile Makeovers',
                text: 'Comprehensive smile makeovers that combine cosmetic techniques for a natural, confident result.',
              },
              {
                icon: Gem,
                title: 'Crowns, Veneers & Restorative Solutions',
                text: 'Dental crowns and veneers plus restorative dental solutions to repair and enhance your smile.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.12 * i }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white rounded-2xl border-2 p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: '#4E4D50' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#4E4D50' }}
                >
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12 md:mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 text-center mb-8">
              Why Choose Dr. NS Taylor &amp; Associates Inc.?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  label: 'Experienced Dental Professionals',
                  desc: 'High-quality dental care using modern techniques and equipment.',
                },
                {
                  icon: MapPin,
                  label: 'Convenient Locations',
                  desc: 'Branches in Ruimsig and Weltevreden Park for a trusted dentist near you.',
                },
                {
                  icon: Heart,
                  label: 'Patient-Focused Care',
                  desc: 'Personalised treatment plans for children, adults, and families.',
                },
                {
                  icon: Zap,
                  label: 'Modern Dental Solutions',
                  desc: 'Comprehensive treatments from preventative care to advanced restorative procedures.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex items-start gap-3 rounded-xl p-4 text-white"
                  style={{ backgroundColor: '#434448' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{item.label}</p>
                    <p className="text-xs text-gray-300 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              If you are looking for a cosmetic dentist Roodepoort patients trust, our team is
              ready to help you achieve a brighter, healthier smile.
            </p>
            <Link to="/contact" className="inline-block">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-auto min-w-[260px]"
                className="px-8 bg-white text-gray-800 border-gray-200 text-base"
                as="div"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Schedule Your Consultation
              </MovingBorderButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Book appointment – Section 3 */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Book an Appointment with a Dentist Near You
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              If you are searching for a professional dentist Roodepoort residents can rely on,
              contact Dr. NS Taylor &amp; Associates Inc. today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 rounded-2xl p-6 md:p-8 text-white"
              style={{ backgroundColor: '#434448' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold">
                  Visit Our Ruimsig &amp; Weltevreden Park Branches
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Our friendly team is ready to assist you with quality dental care at both
                locations. Choosing the right dentist is important for your long-term oral
                health—patients choose us for experienced professionals, convenient locations,
                patient-focused care, and modern dental solutions under one roof.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl border-2 p-6 md:p-8"
              style={{ borderColor: '#4E4D50' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: '#4E4D50' }}
              >
                <Smile className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold text-gray-800 mb-4">
                Trusted Dentistry Near You
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Experience trusted dentistry focused on healthy smiles and long-term oral
                wellness. Contact us today to book your appointment.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              From routine check-ups to cosmetic and restorative care, we are here to help
              patients across Roodepoort and surrounding areas.
            </p>
            <Link to="/contact" className="inline-block">
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-14 w-auto min-w-[260px]"
                className="px-8 bg-white text-gray-800 border-gray-200 text-base"
                as="div"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Contact Us Today
              </MovingBorderButton>
            </Link>
          </motion.div>
        </div>
      </section>

      <GoogleReviews />
      <CTA />
    </>
  )
}

export default Home
