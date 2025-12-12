import { useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export const useScrollAnimation = (options?: {
  once?: boolean
  margin?: string
  amount?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    once: options?.once ?? true, 
    margin: options?.margin ?? '-100px',
    amount: options?.amount ?? 0.3
  })
  
  return { ref, isInView }
}

// Advanced scroll animation hook with parallax
export const useParallaxScroll = (distance: number = 50) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])

  return { ref, y, opacity, scale, scrollYProgress }
}

// Fade in on scroll hook
export const useFadeInScroll = (delay: number = 0) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return {
    ref,
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: isInView 
      ? { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          transition: {
            delay,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Custom easing
          }
        }
      : { opacity: 0, y: 40, filter: "blur(10px)" }
  }
}

// Stagger children animation hook
export const useStaggerScroll = (staggerDelay: number = 0.1) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return {
    ref,
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.2,
        },
      },
    },
    initial: "hidden",
    animate: isInView ? "visible" : "hidden"
  }
}
