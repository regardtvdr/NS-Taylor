import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import BookingStepper from '../components/booking/BookingStepper'
import BranchSelection from '../components/booking/BranchSelection'
import ServiceSelection from '../components/booking/ServiceSelection'
import DentistSelection from '../components/booking/DentistSelection'
import DateTimeSelection from '../components/booking/DateTimeSelection'
import PatientDetails from '../components/booking/PatientDetails'
import DisclaimerStep from '../components/booking/DisclaimerStep'
import POPIAConsentStep from '../components/booking/POPIAConsentStep'
import PaymentStep from '../components/booking/PaymentStep'
import { BookingData, Service, Dentist } from '../types'
import { useBookings } from '../hooks/useBookings'

const STEPS = ['Branch', 'Service', 'Dentist', 'Date & Time', 'Details', 'Cancellation', 'POPIA', 'Payment']

interface ExtendedBookingData extends BookingData {
  branch: string | null
  paymentMethod: 'ozow' | 'instant-eft' | null
  popiaAccepted: boolean
}

const Booking = () => {
  const navigate = useNavigate()
  const { bookings } = useBookings()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<ExtendedBookingData>({
    branch: null,
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
    popiaAccepted: false,
    paymentMethod: null,
  })

  const updateBookingData = (updates: Partial<ExtendedBookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.branch !== null
      case 2:
        return bookingData.service !== null
      case 3:
        return bookingData.dentist !== null
      case 4:
        return bookingData.date !== null && bookingData.time !== ''
      case 5:
        return (
          bookingData.patientDetails.firstName !== '' &&
          bookingData.patientDetails.lastName !== '' &&
          bookingData.patientDetails.email !== '' &&
          bookingData.patientDetails.phone !== ''
        )
      case 6:
        return bookingData.disclaimerAccepted === true
      case 7:
        return bookingData.popiaAccepted === true
      case 8:
        return bookingData.paymentMethod !== null
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

  const handlePatientDetailsChange = useCallback((updates: Partial<ExtendedBookingData['patientDetails']> | { reminders: ExtendedBookingData['reminders'] }) => {
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

  // When branch changes, reset dentist selection
  const handleBranchSelect = (branch: string) => {
    updateBookingData({ branch, dentist: null })
  }

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
              <BranchSelection
                selectedBranch={bookingData.branch}
                onSelect={handleBranchSelect}
              />
            )}

            {currentStep === 2 && (
              <ServiceSelection
                selectedService={bookingData.service}
                onSelect={(service: Service) => updateBookingData({ service })}
              />
            )}

            {currentStep === 3 && (
              <DentistSelection
                selectedDentist={bookingData.dentist}
                onSelect={(dentist: Dentist) => updateBookingData({ dentist })}
                selectedBranch={bookingData.branch}
              />
            )}

            {currentStep === 4 && (
              <DateTimeSelection
                selectedDate={bookingData.date}
                selectedTime={bookingData.time}
                selectedDentist={bookingData.dentist?.name || null}
                bookings={bookings}
                onDateSelect={(date) => updateBookingData({ date })}
                onTimeSelect={(time) => updateBookingData({ time })}
              />
            )}

            {currentStep === 5 && (
              <PatientDetails
                data={bookingData}
                onChange={handlePatientDetailsChange}
              />
            )}

            {currentStep === 6 && (
              <DisclaimerStep
                accepted={bookingData.disclaimerAccepted}
                onAccept={(accepted) => updateBookingData({ disclaimerAccepted: accepted })}
              />
            )}

            {currentStep === 7 && (
              <POPIAConsentStep
                accepted={bookingData.popiaAccepted}
                onAccept={(accepted) => updateBookingData({ popiaAccepted: accepted })}
              />
            )}

            {currentStep === 8 && (
              <PaymentStep
                selectedMethod={bookingData.paymentMethod}
                onSelect={(method) => updateBookingData({ paymentMethod: method })}
                servicePrice={bookingData.service?.price || 0}
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
              className={`flex items-center justify-center space-x-2 text-sm w-full sm:w-auto py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                !canProceed() ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: '#4E4D50' }}
            >
              <span>{currentStep === STEPS.length ? 'Pay R50 & Complete Booking' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Booking

