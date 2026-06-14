import { Link } from 'react-router-dom'

/**
 * SEO landing page for Krugersdorp — not linked in main navigation.
 * Content is crawlable for search engines; discoverable via sitemap and direct URL.
 */
const DentistKrugersdorp = () => {
  return (
    <article className="min-h-screen bg-white pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-6 tracking-tight">
          Dentist Krugersdorp – Trusted Dental Care at Dr. NS Taylor &amp; Associates Inc.
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Looking for a reliable dentist in Krugersdorp? Dr. NS Taylor &amp; Associates Inc. provides
          high-quality, patient-focused dental care designed to keep your smile healthy, confident,
          and long-lasting. With a strong reputation for professional service and modern treatment
          methods, our practice is committed to delivering exceptional dental care for individuals
          and families across Krugersdorp and surrounding areas.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          We understand that choosing the right dentist is important for your long-term oral health,
          which is why we focus on comfort, precision, and personalised treatment plans.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">
          Comprehensive Dental Services in Krugersdorp
        </h2>
        <p className="text-gray-600 leading-relaxed mb-10">
          At Dr. NS Taylor &amp; Associates Inc., we offer a full range of general, cosmetic, and
          restorative dental services to meet all your oral health needs. Whether you require routine
          maintenance or advanced dental treatment, our experienced team is here to help.
        </p>

        <h3 className="text-xl font-display font-semibold text-gray-800 mb-3">
          General Dentistry &amp; Preventative Care
        </h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          Regular check-ups are essential to maintain healthy teeth and gums. Our general dentistry
          services include dental examinations, professional cleanings, fillings, gum disease
          treatment, and oral health assessments. Preventative care helps detect issues early and
          avoid more complex procedures later.
        </p>

        <h3 className="text-xl font-display font-semibold text-gray-800 mb-3">
          Cosmetic Dentistry for a Confident Smile
        </h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          If you are looking to improve the appearance of your smile, our cosmetic dentistry
          solutions include teeth whitening, veneers, crowns, and smile enhancement treatments. We aim
          to create natural-looking results that boost confidence and improve overall aesthetics.
        </p>

        <h3 className="text-xl font-display font-semibold text-gray-800 mb-3">
          Restorative Dental Treatments
        </h3>
        <p className="text-gray-600 leading-relaxed mb-10">
          We also provide restorative treatments such as root canal therapy, tooth extractions, and
          dental repairs. These procedures are designed to restore function, comfort, and oral health
          while preserving your natural teeth whenever possible.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">
          Why Choose Our Krugersdorp Dental Practice?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Patients choose Dr. NS Taylor &amp; Associates Inc. because we combine modern dental
          technology with personalised care. Our focus is always on patient comfort, clear
          communication, and long-term oral health solutions.
        </p>
        <p className="text-gray-600 leading-relaxed mb-10">
          We serve patients from Krugersdorp and nearby areas, offering accessible and professional
          dental care in a welcoming environment. Whether it&apos;s your first visit or ongoing
          treatment, we ensure every patient receives attention tailored to their needs.
        </p>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800 mb-4">
          Your Local Dentist in Krugersdorp
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          If you are searching for a trusted dentist Krugersdorp residents can rely on, Dr. NS Taylor
          &amp; Associates Inc. is here to help. From routine dental care to advanced restorative and
          cosmetic treatments, we are committed to helping you achieve and maintain a healthy smile.
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">
          Book your appointment today and experience professional dental care you can trust.
        </p>

        <Link
          to="/contact"
          className="inline-block text-gray-800 font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          Contact us to book an appointment
        </Link>
      </div>
    </article>
  )
}

export default DentistKrugersdorp
