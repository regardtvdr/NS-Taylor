import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import Chatbot from './Chatbot'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Layout

