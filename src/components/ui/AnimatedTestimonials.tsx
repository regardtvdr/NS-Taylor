import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
}

export const AnimatedTestimonials = ({
  testimonials,
}: {
  testimonials: Testimonial[]
}) => {
  const [active, setActive] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered && testimonials.length > 0) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length, isHovered])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-20">
      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          animate={{
            x: `-${active * 100}%`,
          }}
          transition={{
            duration: 0.5,
            ease: [0.645, 0.045, 0.355, 1],
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="min-w-full px-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-800 bg-white p-8 shadow-lg">
                <Quote className="absolute -top-4 -left-4 h-24 w-24 text-gray-100" />
                <div className="relative">
                  <p className="mb-6 text-lg text-gray-700">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    {testimonial.src ? (
                      <img
                        src={testimonial.src}
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover"
                        loading="lazy"
                        width="64"
                        height="64"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`h-2 rounded-full transition-all ${
              active === idx ? "w-8 bg-gray-800" : "w-2 bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

