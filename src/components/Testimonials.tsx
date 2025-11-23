import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { REVIEWS } from '../utils/constants'
import { Star, Quote } from 'lucide-react'
import { AnimatedGridPattern } from './ui/animated-grid-pattern'
import { cn } from '../lib/utils'

const Testimonials = () => {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            What Our Patients Say
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied patients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md border-2 border-gray-900 p-6 relative"
            >
              <Quote className="w-6 h-6 text-gray-300 absolute top-4 right-4" />
              
              <div className="flex items-center mb-4">
                <img
                  src={review.avatar}
                  alt={`${review.name} - Patient Review`}
                  className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-100"
                  loading="lazy"
                  width="40"
                  height="40"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                  <div className="flex items-center space-x-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-800 mb-4 text-sm leading-relaxed">"{review.comment}"</p>
              
              <p className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

