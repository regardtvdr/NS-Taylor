import { Link } from 'react-router-dom'
import { Mail, Phone, Facebook } from 'lucide-react'
import { Button as MovingBorderButton } from './ui/moving-border'

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

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
              className="mt-4 inline-block"
            >
              <MovingBorderButton
                borderRadius="0.75rem"
                containerClassName="h-10 w-auto"
                className="px-4 bg-white text-gray-800 border-gray-200"
                as="div"
              >
                Leave a Review
              </MovingBorderButton>
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
            <div className="space-y-4 text-sm">
              {/* Ruimsig */}
              <div>
                <p className="font-medium text-white mb-1">Ruimsig</p>
                <div className="flex items-center space-x-2 mb-1">
                  <Phone className="w-4 h-4 text-gray-200" />
                  <span className="text-gray-200">010 100 8410</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-200" />
                  <span className="text-gray-200">enquiries@dentalrooms.co.za</span>
                </div>
              </div>
              {/* Weltevreden Park */}
              <div>
                <p className="font-medium text-white mb-1">Weltevreden Park</p>
                <div className="flex items-center space-x-2 mb-1">
                  <Phone className="w-4 h-4 text-gray-200" />
                  <span className="text-gray-200">011 679 2961</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-200" />
                  <span className="text-gray-200">enquiries@dentaloffices.co.za</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              {/* Facebook Button */}
              <a
                href="https://www.facebook.com/share/p/1JRmjqmwnX/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg px-3 py-2 transition-all hover:scale-[1.02] text-sm w-fit"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium">Facebook</span>
              </a>
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/27798639823"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg px-3 py-2 transition-all hover:scale-[1.02] text-sm w-fit"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span className="font-medium">+27 (79) 863-9823</span>
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

