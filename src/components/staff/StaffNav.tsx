import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Calendar, List, Users, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const StaffNav = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/staff/today', label: 'Today', icon: Calendar },
    { path: '/staff/bookings', label: 'Bookings', icon: List },
    { path: '/staff/patients', label: 'Patients', icon: Users },
  ]

  const isActive = (path: string) => {
    if (path === '/staff/dashboard') {
      return location.pathname === '/staff' || location.pathname === '/staff/dashboard'
    }
    return location.pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 font-medium transition-colors text-sm py-2 ${
                    isActive(item.path)
                      ? 'text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-600"
                      layoutId="staffActiveTab"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default StaffNav

