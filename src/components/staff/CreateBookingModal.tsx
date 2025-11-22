import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Calendar, Clock, DollarSign } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { SERVICES, DENTISTS } from '../../utils/constants'
import { Service, Dentist } from '../../types'
import { generateTimeSlots } from '../../utils/dateUtils'
import 'react-day-picker/dist/style.css'

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (booking: any) => void
}

const CreateBookingModal = ({ isOpen, onClose, onSave }: CreateBookingModalProps) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    service: null as Service | null,
    dentist: null as Dentist | null,
    date: null as Date | null,
    time: '',
    depositPaid: false,
    depositAmount: 50,
    notes: '',
  })

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const timeSlots = formData.date ? generateTimeSlots(formData.date) : []

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      service: null,
      dentist: null,
      date: null,
      time: '',
      depositPaid: false,
      depositAmount: 50,
      notes: '',
    })
    setStep(1)
    setIsCalendarOpen(false)
  }

  const handleSave = () => {
    if (
      formData.patientName &&
      formData.patientEmail &&
      formData.patientPhone &&
      formData.service &&
      formData.dentist &&
      formData.date &&
      formData.time
    ) {
      onSave({
        id: `BK-${Date.now()}`,
        patient: formData.patientName,
        email: formData.patientEmail,
        phone: formData.patientPhone,
        service: formData.service.name,
        dentist: formData.dentist.name,
        date: format(formData.date, 'yyyy-MM-dd'),
        time: formData.time,
        status: 'confirmed',
        deposit: formData.depositPaid ? formData.depositAmount : 0,
        total: formData.service.price,
        notes: formData.notes,
      })
      resetForm()
      onClose()
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.patientName && formData.patientEmail && formData.patientPhone
      case 2:
        return formData.service !== null && formData.dentist !== null
      case 3:
        return formData.date !== null && formData.time !== ''
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-800">Create New Booking</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s === step
                        ? 'bg-gray-800 text-white'
                        : s < step
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        s < step ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Patient Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
                  Patient Information
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="input-field pl-12"
                      placeholder="Enter patient name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="input-field pl-12"
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="input-field pl-12"
                      placeholder="+27 82 123 4567"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Service & Dentist */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
                  Service & Dentist
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Select Service *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SERVICES.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setFormData({ ...formData, service })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.service?.id === service.id
                            ? 'border-gray-700 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-semibold text-gray-800 mb-1">{service.name}</div>
                        <div className="text-sm text-gray-600">R{service.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Select Dentist *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {DENTISTS.map((dentist) => (
                      <button
                        key={dentist.id}
                        onClick={() => setFormData({ ...formData, dentist })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.dentist?.id === dentist.id
                            ? 'border-gray-700 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-semibold text-gray-800 mb-1">{dentist.name}</div>
                        <div className="text-xs text-gray-600">{dentist.specialization}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date, Time & Deposit */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-800 mb-4">
                  Date, Time & Payment
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select Date *
                  </label>
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-full p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className={formData.date ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                        {formData.date ? format(formData.date, 'EEEE, MMMM d, yyyy') : 'Select a date'}
                      </span>
                    </div>
                  </button>
                  {isCalendarOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-white rounded-lg shadow-md p-3 border border-gray-200"
                    >
                      <DayPicker
                        mode="single"
                        selected={formData.date || undefined}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({ ...formData, date, time: '' })
                            setIsCalendarOpen(false)
                          }
                        }}
                        disabled={(date) => {
                          const day = date.getDay()
                          return day === 0 || day === 6
                        }}
                        modifiersClassNames={{
                          selected: 'bg-gray-800 text-white rounded-full',
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                {formData.date && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Select Time *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData({ ...formData, time })}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            formData.time === time
                              ? 'border-gray-700 bg-gray-50 text-gray-800'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Total</span>
                    <span className="font-semibold text-gray-800">
                      R{formData.service?.price || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="depositPaid"
                      checked={formData.depositPaid}
                      onChange={(e) => setFormData({ ...formData, depositPaid: e.target.checked })}
                      className="w-5 h-5 text-gray-700 rounded"
                    />
                    <label htmlFor="depositPaid" className="text-sm text-gray-700">
                      Deposit Paid (R{formData.depositAmount})
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Any additional notes about this booking..."
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                  step === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>Back</span>
              </button>

              {step < 3 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center space-x-2 text-sm ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Continue</span>
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!canProceed()}
                  className={`btn-primary flex items-center space-x-2 text-sm ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>Create Booking</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CreateBookingModal

