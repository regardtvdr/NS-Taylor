import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import BookingStepper from '../components/booking/BookingStepper'
import ServiceSelection from '../components/booking/ServiceSelection'
import DentistSelection from '../components/booking/DentistSelection'
import DateTimeSelection from '../components/booking/DateTimeSelection'
import PatientDetails from '../components/booking/PatientDetails'
import DisclaimerStep from '../components/booking/DisclaimerStep'
import { BookingData, Service, Dentist } from '../types'

const STEPS = ['Service', 'Dentist', 'Date & Time', 'Details', 'Disclaimer']

const Booking = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    dentist: null,
    date: null,
    time: '',
    patientDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    reminders: {
      sms: false,
      whatsapp: false,
      calendar: false,
    },
    disclaimerAccepted: false,
  })

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service !== null
      case 2:
        return bookingData.dentist !== null
      case 3:
        return bookingData.date !== null && bookingData.time !== ''
      case 4:
        return (
          bookingData.patientDetails.firstName !== '' &&
          bookingData.patientDetails.lastName !== '' &&
          bookingData.patientDetails.email !== '' &&
          bookingData.patientDetails.phone !== ''
        )
      case 5:
        return bookingData.disclaimerAccepted === true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit booking
      navigate('/booking/confirm', { state: bookingData })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePatientDetailsChange = useCallback((updates: Partial<BookingData['patientDetails']> | { reminders: BookingData['reminders'] }) => {
    if ('reminders' in updates) {
      updateBookingData({ reminders: updates.reminders })
    } else {
      setBookingData((prev) => ({
        ...prev,
        patientDetails: {
          ...prev.patientDetails,
          ...updates,
        },
      }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Stepper */}
        <BookingStepper currentStep={currentStep} steps={STEPS} />

        {/* Content Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-10"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <ServiceSelection
                selectedService={bookingData.service}
                onSelect={(service: Service) => updateBookingData({ service })}
              />
            )}

            {currentStep === 2 && (
              <DentistSelection
                selectedDentist={bookingData.dentist}
                onSelect={(dentist: Dentist) => updateBookingData({ dentist })}
              />
            )}

            {currentStep === 3 && (
              <DateTimeSelection
                selectedDate={bookingData.date}
                selectedTime={bookingData.time}
                onDateSelect={(date) => updateBookingData({ date })}
                onTimeSelect={(time) => updateBookingData({ time })}
              />
            )}

            {currentStep === 4 && (
              <PatientDetails
                data={bookingData}
                onChange={handlePatientDetailsChange}
              />
            )}

            {currentStep === 5 && (
              <DisclaimerStep
                accepted={bookingData.disclaimerAccepted}
                onAccept={(accepted) => updateBookingData({ disclaimerAccepted: accepted })}
              />
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mt-6 md:mt-10 pt-4 md:pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`btn-primary flex items-center justify-center space-x-2 text-sm w-full sm:w-auto ${
                !canProceed() ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <span>{currentStep === STEPS.length ? 'Complete Booking' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Booking

