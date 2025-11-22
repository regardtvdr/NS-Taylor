import { motion } from 'framer-motion'
import { Check, Award, Clock, Star } from 'lucide-react'
import { Dentist } from '../../types'
import { DENTISTS } from '../../utils/constants'

interface DentistSelectionProps {
  selectedDentist: Dentist | null
  onSelect: (dentist: Dentist) => void
}

const DentistSelection = ({ selectedDentist, onSelect }: DentistSelectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Select Your Dentist
        </h2>
        <p className="text-sm text-gray-500">Choose your preferred dental professional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DENTISTS.map((dentist, index) => (
          <motion.button
            key={dentist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(dentist)}
            className={`relative p-6 rounded-lg border text-left transition-all duration-200 ${
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
                className="absolute top-4 right-4 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
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
                  <span className="text-2xl font-bold text-gray-600">
                    {dentist.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 tracking-tight">
                  {dentist.name}
                </h3>
                <p className="text-sm text-gray-600">{dentist.specialization}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-gray-500" />
                <span>{dentist.experience} years experience</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium">{dentist.rating}</span>
                <span className="text-gray-500">({dentist.reviews} reviews)</span>
              </div>
              {dentist.qualifications && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{dentist.qualifications}</span>
                </div>
              )}
            </div>

            {dentist.bio && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
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

