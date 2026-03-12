import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Services from '../components/Services'
import GoogleReviews from '../components/GoogleReviews'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <>
      <Hero />

      {/* Trusted Dental Clinic – Content Page 1 */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6">
                Trusted Dental Clinic – DR NS Taylor & Associates Inc.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Looking for a dentist near you who offers professional, affordable and compassionate care? At DR NS Taylor & Associates Inc., we are a leading dental clinic providing comprehensive dental care services for patients of all ages. As a modern dental practice, we focus on long-term oral health, comfort and quality treatment outcomes.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Your Family Dentist for Complete Dental Care
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Our experienced team is proud to be your trusted family dentist, offering everything from routine dental checkup appointments to advanced restorative procedures. Whether you need preventative care or a crown and bridge dentist, we ensure personalised treatment plans tailored to your needs.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">We provide:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-2">
                <li>Comprehensive general dentistry</li>
                <li>Professional cleanings and exams</li>
                <li>Tooth-coloured fillings</li>
                <li>Crowns and bridges</li>
                <li>Preventative and restorative dental care</li>
              </ul>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                If you've been searching for a dentist around me or dental clinic near you, our friendly team is ready to help you achieve a healthy, confident smile.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Affordable Dentist Prices Without Compromising Quality
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Understanding dentist prices is important when choosing the best dentist for your family. At DR NS Taylor & Associates Inc., we are committed to transparent pricing and ethical treatment recommendations. Our goal is to deliver high-quality dental care that remains accessible and affordable.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We combine modern technology with years of clinical expertise to ensure accurate diagnoses and effective treatment. From your first consultation at our oral health clinic, you'll experience a patient-focused approach designed to make every visit comfortable and stress-free.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Comprehensive General Dentistry Services
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                As a trusted dentist, we emphasise preventative care to reduce long-term dental issues. Regular dental checkup appointments allow us to detect problems early and protect your oral health. Our full range of dental care services ensures that you and your family receive everything you need under one roof.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-6">
                Choose DR NS Taylor & Associates Inc. when searching for a reliable Dental Clinic that prioritises your smile. <Link to="/contact" className="font-semibold text-gray-800 underline hover:no-underline">Book your appointment today</Link> and discover why so many patients consider us their preferred best dentist for quality, affordable and professional care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Services />

      {/* Professional Teeth Whitening & Cleaning – Content Page 2 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6">
                Professional Teeth Whitening & Cleaning at DR NS Taylor & Associates Inc.
              </h2>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Brighten Your Smile with Expert Teeth Whitening
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At DR NS Taylor & Associates Inc., we specialize in professional teeth whitening services designed to give you a brighter, more confident smile. Our advanced whitening treatments are safe, effective, and tailored to your unique dental needs. Whether you are preparing for a special event or just want to enhance your everyday smile, our team ensures lasting results and minimal sensitivity.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Comprehensive Teeth Cleaning Services
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Maintaining oral health starts with thorough professional teeth cleaning. Our dental experts provide deep cleaning to remove plaque, tartar, and surface stains, helping prevent cavities, gum disease, and bad breath. Regular teeth cleaning not only improves oral hygiene but also supports overall health.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Teeth Whitening in Roodepoort & Ruimsig
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Residents in Roodepoort and Ruimsig trust DR NS Taylor & Associates Inc. for exceptional teeth whitening services. Using cutting-edge techniques, we remove stubborn stains caused by coffee, tea, smoking, and aging. Experience a brighter smile that looks natural and enhances your confidence.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Why Choose DR NS Taylor & Associates Inc.?
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-2">
                <li><strong>Experienced Dental Professionals:</strong> Our skilled team provides personalized care.</li>
                <li><strong>Advanced Whitening Technology:</strong> Safe and fast results with minimal discomfort.</li>
                <li><strong>Family-Friendly Dental Practice:</strong> Serving patients of all ages.</li>
                <li><strong>Convenient Locations:</strong> Easily accessible in Roodepoort and Ruimsig.</li>
              </ul>
              <p className="text-lg text-gray-600 leading-relaxed">
                Achieve a radiant, healthy smile with our professional teeth whitening and teeth cleaning services. <Link to="/contact" className="font-semibold text-gray-800 underline hover:no-underline">Schedule your consultation</Link> with DR NS Taylor & Associates Inc. and discover the difference of expert dental care. Your smile deserves the best!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dental Implants & Cosmetic Dentistry – Content Page 3 */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6">
                Dental Implants at DR NS Taylor & Associates Inc.
              </h2>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Restore Your Smile with Expert Dental Implants
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At DR NS Taylor & Associates Inc., we specialize in providing high-quality dental implants that restore both function and aesthetics. Missing teeth can affect your confidence, chewing ability, and oral health. Our team of experienced dental professionals ensures a comfortable and precise implant procedure tailored to your needs.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Cosmetic Dentistry Services for a Radiant Smile
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Enhance your smile with our range of cosmetic dentistry services. From teeth whitening to veneers and contouring, our goal is to give you a natural, beautiful smile. We combine advanced technology with artistic precision to ensure every treatment is safe, effective, and minimally invasive.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Affordable Dental Implants for Every Patient
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We believe that quality dental care should be accessible. That's why we offer affordable dental implants without compromising on quality. Our team works with you to create personalized treatment plans and flexible payment options, making dental restoration achievable for all our patients.
              </p>
              <h3 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-4">
                Why Choose DR NS Taylor & Associates Inc.?
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6 ml-2">
                <li>State-of-the-art dental technology for precise implant placement</li>
                <li>Experienced cosmetic dentists focused on aesthetics and comfort</li>
                <li>Comprehensive care, including consultations, surgery, and follow-ups</li>
                <li>Affordable pricing and flexible payment plans</li>
                <li>A patient-centered approach prioritizing your oral health and confidence</li>
              </ul>
              <p className="text-lg text-gray-600 leading-relaxed">
                Don't let missing teeth or dental concerns hold you back. <Link to="/contact" className="font-semibold text-gray-800 underline hover:no-underline">Contact DR NS Taylor & Associates Inc. today</Link> to schedule a consultation and explore our dental implants, cosmetic dentistry, and affordable treatment options. Your dream smile is just a visit away.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <GoogleReviews />
      <CTA />
    </>
  )
}

export default Home

