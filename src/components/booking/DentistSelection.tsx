import { motion } from 'framer-motion'
import { Check, Award, Clock, Star } from 'lucide-react'
import { Dentist } from '../../types'
import { DENTISTS } from '../../utils/constants'

interface DentistSelectionProps {
  selectedDentist: Dentist | null
  onSelect: (dentist: Dentist) => void
  selectedBranch?: string | null
}

const DentistSelection = ({ selectedDentist, onSelect, selectedBranch }: DentistSelectionProps) => {
  // Filter dentists based on selected branch
  const branchName = selectedBranch === 'weltevreden' ? 'Weltevreden Park' : selectedBranch === 'ruimsig' ? 'Ruimsig' : null
  const filteredDentists = branchName 
    ? DENTISTS.filter(d => d.branch === branchName)
    : DENTISTS

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Select Your Dentist
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          {branchName 
            ? `Choose your preferred dental professional at ${branchName}`
            : 'Choose your preferred dental professional'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredDentists.map((dentist, index) => (
          <motion.button
            key={dentist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(dentist)}
            className={`relative p-4 md:p-6 rounded-lg border text-left transition-all duration-200 ${
              selectedDentist?.id === dentist.id
                ? 'border-gray-700 bg-gray-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedDentist?.id === dentist.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 md:top-4 md:right-4 w-5 h-5 md:w-6 md:h-6 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </motion.div>
            )}

            <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {dentist.avatar ? (
                  <img
                    src={dentist.avatar}
                    alt={`${dentist.name} - ${dentist.specialization}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="64"
                    height="64"
                  />
                ) : (
                  <span className="text-lg md:text-2xl font-bold text-gray-600">
                    {dentist.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 tracking-tight">
                  {dentist.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 truncate">{dentist.specialization}</p>
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                <Award className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{dentist.experience} years experience</span>
              </div>
              <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                <span className="font-medium">{dentist.rating}</span>
                <span className="text-gray-500">({dentist.reviews} reviews)</span>
              </div>
              {dentist.qualifications && (
                <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{dentist.qualifications}</span>
                </div>
              )}
            </div>

            {dentist.bio && (
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                {dentist.bio}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default DentistSelection

