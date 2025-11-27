import { motion } from 'framer-motion'
import { Check, MapPin, Phone, Clock } from 'lucide-react'

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  hours: string
}

const BRANCHES: Branch[] = [
  {
    id: 'weltevreden',
    name: 'Weltevreden Park',
    address: 'The Gables Unit no.2, 879 Tennis Rd, Weltevreden Park Ext 25, 1709',
    phone: '011 679 2961',
    hours: 'Mon-Fri: 8:00 AM - 4:30 PM',
  },
  {
    id: 'ruimsig',
    name: 'Ruimsig',
    address: 'Unit 5, Ruimsig Country Office Park, 129 Hole In One St, Ruimsig, 1724',
    phone: '010 100 8410',
    hours: 'Mon-Fri: 8:00 AM - 4:30 PM',
  },
]

interface BranchSelectionProps {
  selectedBranch: string | null
  onSelect: (branch: string) => void
}

const BranchSelection = ({ selectedBranch, onSelect }: BranchSelectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Select Your Branch
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Choose which practice location you'd like to visit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {BRANCHES.map((branch, index) => (
          <motion.button
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(branch.id)}
            className={`relative p-5 md:p-6 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedBranch === branch.id
                ? 'bg-gray-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
            style={selectedBranch === branch.id ? { borderColor: '#4E4D50' } : {}}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedBranch === branch.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4E4D50' }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            <div className="flex items-start space-x-4 mb-4">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#4E4D50' }}
              >
                <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 tracking-tight">
                  {branch.name}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{branch.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{branch.hours}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default BranchSelection

