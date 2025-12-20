import { motion } from 'framer-motion'

const GoogleReviews = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 tracking-tight mb-3 md:mb-4">
            What Our Patients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read reviews from our valued patients on Google
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <iframe
            src="https://505a4ba127d94e65b66e14d4123ac365.elf.site"
            width="100%"
            height="600"
            style={{ border: 'none', borderRadius: '12px' }}
            title="Google Reviews"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default GoogleReviews

