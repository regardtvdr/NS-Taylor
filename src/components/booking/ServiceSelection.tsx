import { motion } from 'framer-motion'
import { Service } from '../../types'
import { SERVICES } from '../../utils/constants'
import { Clock, Check } from 'lucide-react'

interface ServiceSelectionProps {
  selectedService: Service | null
  onSelect: (service: Service) => void
}

const ServiceSelection = ({ selectedService, onSelect }: ServiceSelectionProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Select a Service
        </h2>
        <p className="text-sm text-gray-500">Choose the service you'd like to book</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service, index) => (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(service)}
            className={`relative p-5 rounded-md border text-left transition-all duration-200 ${
              selectedService?.id === service.id
                ? 'border-gray-600 bg-gray-50'
                : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {selectedService?.id === service.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}

            <h3 className="text-base font-semibold text-gray-800 mb-1.5 tracking-tight">
              {service.name}
            </h3>
            <p className="text-gray-600 mb-3 text-xs leading-relaxed">{service.description}</p>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{service.duration} min</span>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                R{service.price}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ServiceSelection

