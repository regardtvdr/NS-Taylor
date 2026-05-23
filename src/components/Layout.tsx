import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import Chatbot from './Chatbot'
import PageSEO from './PageSEO'
import { getPageSEO } from '../utils/seo'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation()
  const seo = getPageSEO(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO {...seo} />
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

