import { Check } from 'lucide-react'

interface BookingStepperProps {
  currentStep: number
  steps: string[]
}

const BookingStepper = ({ currentStep, steps }: BookingStepperProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gray-600 text-white'
                      : isCurrent
                      ? 'bg-gray-800 text-white scale-110'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                      <span className="text-sm">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium text-center ${
                    isCurrent ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all duration-300 ${
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

