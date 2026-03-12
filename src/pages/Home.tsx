import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Stethoscope, Sparkles, Palette, Crown, ShieldCheck, Heart, DollarSign, CheckCircle, Sun, Droplets, MapPin, Users, Zap, Activity, Smile, Gem, CreditCard, UserCheck, ClipboardCheck } from 'lucide-react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import GoogleReviews from '../components/GoogleReviews'
import CTA from '../components/CTA'
import { Button as MovingBorderButton } from '../components/ui/moving-border'

const Home = () => {
  return (
    <>
      <Hero />

      {/* Trusted Dental Clinic – Content Page 1 */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Trusted Dental Clinic
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Looking for a dentist near you who offers professional, affordable and compassionate care? At DR NS Taylor & Associates Inc., we are a leading dental clinic providing comprehensive dental care services for patients of all ages. As a modern dental practice, we focus on long-term oral health, comfort and quality treatment outcomes.
            </p>
          </motion.div>

          {/* Two-column: Family Dentist + Services cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-5">
                Your Family Dentist for Complete Dental Care
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our experienced team is proud to be your trusted family dentist, offering everything from routine dental checkup appointments to advanced restorative procedures. Whether you need preventative care or a crown and bridge dentist, we ensure personalised treatment plans tailored to your needs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you've been searching for a dentist around me or dental clinic near you, our friendly team is ready to help you achieve a healthy, confident smile.
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
                { icon: Stethoscope, label: 'Comprehensive general dentistry' },
                { icon: Sparkles, label: 'Professional cleanings and exams' },
                { icon: Palette, label: 'Tooth-coloured fillings' },
                { icon: Crown, label: 'Crowns and bridges' },
                { icon: ShieldCheck, label: 'Preventative and restorative dental care' },
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-snug">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Affordable + Comprehensive cards */}
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
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold">
                  Affordable Prices, No Compromise
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-4">
                Understanding dentist prices is important when choosing the best dentist for your family. At DR NS Taylor & Associates Inc., we are committed to transparent pricing and ethical treatment recommendations. Our goal is to deliver high-quality dental care that remains accessible and affordable.
              </p>
              <p className="text-gray-200 leading-relaxed">
                We combine modern technology with years of clinical expertise to ensure accurate diagnoses and effective treatment. From your first consultation at our oral health clinic, you'll experience a patient-focused approach designed to make every visit comfortable and stress-free.
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4E4D50' }}>
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800">
                  Comprehensive General Dentistry
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                As a trusted dentist, we emphasise preventative care to reduce long-term dental issues. Regular dental checkup appointments allow us to detect problems early and protect your oral health.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our full range of dental care services ensures that you and your family receive everything you need under one roof.
              </p>
            </motion.div>
          </div>

          {/* CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Choose DR NS Taylor & Associates Inc. when searching for a reliable Dental Clinic that prioritises your smile. Discover why so many patients consider us their preferred best dentist for quality, affordable and professional care.
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

      {/* Professional Teeth Whitening & Cleaning – Content Page 2 */}
      <section className="py-16 md:py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Professional Teeth Whitening & Cleaning
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Brighten your smile with safe, effective treatments tailored to your unique dental needs.
            </p>
          </motion.div>

          {/* Three feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
            {[
              {
                icon: Sun,
                title: 'Expert Teeth Whitening',
                text: 'At DR NS Taylor & Associates Inc., we specialize in professional teeth whitening services designed to give you a brighter, more confident smile. Our advanced whitening treatments are safe, effective, and tailored to your unique dental needs. Whether you are preparing for a special event or just want to enhance your everyday smile, our team ensures lasting results and minimal sensitivity.',
              },
              {
                icon: Droplets,
                title: 'Comprehensive Teeth Cleaning',
                text: 'Maintaining oral health starts with thorough professional teeth cleaning. Our dental experts provide deep cleaning to remove plaque, tartar, and surface stains, helping prevent cavities, gum disease, and bad breath. Regular teeth cleaning not only improves oral hygiene but also supports overall health.',
              },
              {
                icon: MapPin,
                title: 'Whitening in Roodepoort & Ruimsig',
                text: 'Residents in Roodepoort and Ruimsig trust DR NS Taylor & Associates Inc. for exceptional teeth whitening services. Using cutting-edge techniques, we remove stubborn stains caused by coffee, tea, smoking, and aging. Experience a brighter smile that looks natural and enhances your confidence.',
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#4E4D50' }}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold text-gray-800 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us – horizontal badges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto mb-12 md:mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 text-center mb-8">
              Why Choose DR NS Taylor & Associates Inc.?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Experienced Dental Professionals', desc: 'Our skilled team provides personalized care.' },
                { icon: Zap, label: 'Advanced Whitening Technology', desc: 'Safe and fast results with minimal discomfort.' },
                { icon: Heart, label: 'Family-Friendly Practice', desc: 'Serving patients of all ages.' },
                { icon: MapPin, label: 'Convenient Locations', desc: 'Easily accessible in Roodepoort and Ruimsig.' },
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Achieve a radiant, healthy smile with our professional teeth whitening and teeth cleaning services. Discover the difference of expert dental care. Your smile deserves the best!
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

      {/* Dental Implants & Cosmetic Dentistry – Content Page 3 */}
      <section className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 mb-6 tracking-tight">
              Dental Implants & Cosmetic Dentistry
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Restore your smile with expert dental implants and cosmetic treatments that combine function with aesthetics.
            </p>
          </motion.div>

          {/* Three-column content blocks */}
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
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold">
                  Restore Your Smile with Expert Dental Implants
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-5">
                At DR NS Taylor & Associates Inc., we specialize in providing high-quality dental implants that restore both function and aesthetics. Missing teeth can affect your confidence, chewing ability, and oral health. Our team of experienced dental professionals ensures a comfortable and precise implant procedure tailored to your needs.
              </p>
              <div className="h-px bg-white/20 my-5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-display font-bold">
                  Affordable Dental Implants for Every Patient
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
                We believe that quality dental care should be accessible. That's why we offer affordable dental implants without compromising on quality. Our team works with you to create personalized treatment plans and flexible payment options, making dental restoration achievable for all our patients.
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
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: '#4E4D50' }}>
                <Smile className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold text-gray-800 mb-4">
                Cosmetic Dentistry for a Radiant Smile
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Enhance your smile with our range of cosmetic dentistry services. From teeth whitening to veneers and contouring, our goal is to give you a natural, beautiful smile. We combine advanced technology with artistic precision to ensure every treatment is safe, effective, and minimally invasive.
              </p>
            </motion.div>
          </div>

          {/* Why Choose Us – icon list */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-12 md:mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-800 text-center mb-8">
              Why Choose DR NS Taylor & Associates Inc.?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Gem, text: 'State-of-the-art dental technology for precise implant placement' },
                { icon: UserCheck, text: 'Experienced cosmetic dentists focused on aesthetics and comfort' },
                { icon: ClipboardCheck, text: 'Comprehensive care, including consultations, surgery, and follow-ups' },
                { icon: CreditCard, text: 'Affordable pricing and flexible payment plans' },
                { icon: Heart, text: 'A patient-centered approach prioritizing your oral health and confidence' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.08 * i }}
                  className="flex items-center gap-3 rounded-xl border-2 p-4"
                  style={{ borderColor: '#4E4D50' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4E4D50' }}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 leading-snug">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Don't let missing teeth or dental concerns hold you back. Schedule a consultation and explore our dental implants, cosmetic dentistry, and affordable treatment options. Your dream smile is just a visit away.
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

