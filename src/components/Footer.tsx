import { Link } from 'react-router-dom'
import { Mail, Phone, Facebook, Instagram, Twitter, Star } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="text-white border-0 outline-none overflow-hidden" style={{ backgroundColor: '#434448' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 border-0 outline-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-3">Dr. NS Taylor & Associates Inc.</h3>
            <p className="text-gray-200 text-sm mb-4">
              Your trusted partner for exceptional dental care in South Africa.
            </p>
            <img 
              src="/logo.jpg" 
              alt="Dr. NS Taylor & Associates Inc. Logo" 
              className="h-24 w-24 object-contain"
              width="96"
              height="96"
              loading="lazy"
            />
            <a 
              href="https://g.page/r/CWgCwEdWHGcgEBM/review" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              Leave a Review
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-gray-200 hover:text-white transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-gray-200 mt-0.5" />
                <span className="text-gray-200">
                  011 679 2961 (Weltevreden Park)<br />
                  010 100 8410 (Ruimsig)
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-200" />
                <span className="text-gray-200">admin@dentaloffices.co.za</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-200 hover:text-white transition-colors p-2 -m-2" aria-label="Visit our Facebook page">
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors p-2 -m-2" aria-label="Visit our Instagram page">
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors p-2 -m-2" aria-label="Visit our Twitter page">
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-500 text-center text-sm text-gray-200">
          <p>&copy; {new Date().getFullYear()} Dr. NS Taylor and Associates Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

