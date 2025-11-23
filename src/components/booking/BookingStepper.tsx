import { Check } from 'lucide-react'

interface BookingStepperProps {
  currentStep: number
  steps: string[]
}

const BookingStepper = ({ currentStep, steps }: BookingStepperProps) => {
  return (
    <div className="w-full mb-6 md:mb-8 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[500px] md:min-w-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gray-600 text-white'
                      : isCurrent
                      ? 'bg-gray-800 text-white scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-xs md:text-sm">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`mt-1.5 md:mt-2 text-[10px] md:text-xs lg:text-sm font-medium text-center leading-tight ${
                    isCurrent ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-2 transition-all duration-300 ${
                    isCompleted ? 'bg-gray-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BookingStepper

