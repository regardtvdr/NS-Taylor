import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, CreditCard, Check } from 'lucide-react'
import { BookingData } from '../../types'

interface PatientDetailsProps {
  data: BookingData
  onChange: (data: Partial<BookingData['patientDetails']> | { reminders: BookingData['reminders'] }) => void
}

interface InputFieldProps {
  label: string
  name: string
  type?: string
  icon: any
  value: string
  required?: boolean
  focusedField: string | null
  onFocus: (name: string) => void
  onBlur: () => void
  onChange: (name: string, value: string) => void
}

const InputField = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  value,
  required = false,
  focusedField,
  onFocus,
  onBlur,
  onChange,
}: InputFieldProps) => {
  const isFocused = focusedField === name
  const hasValue = value.length > 0

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value)
  }, [name, onChange])

  return (
    <div className="relative">
      <div className="relative">
        <Icon
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            isFocused ? 'text-gray-700' : 'text-gray-400'
          }`}
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => onFocus(name)}
          onBlur={onBlur}
          required={required}
          className="input-field pl-12 pr-4"
        />
        <motion.label
          initial={false}
          animate={{
            y: isFocused || hasValue ? -12 : 0,
            x: isFocused || hasValue ? 12 : 48,
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
          className={`absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors ${
            isFocused || hasValue
              ? 'text-gray-700 bg-white px-2'
              : 'text-gray-500'
          }`}
        >
          {label} {required && '*'}
        </motion.label>
        {hasValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Check className="w-5 h-5 text-gray-700" />
          </motion.div>
        )}
      </div>
    </div>
  )
}

const PatientDetails = ({ data, onChange }: PatientDetailsProps) => {
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = useCallback((name: string, value: string) => {
    onChange({ [name]: value } as Partial<BookingData['patientDetails']>)
  }, [onChange])

  const handleFocus = useCallback((name: string) => {
    setFocusedField(name)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedField(null)
  }, [])

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-semibold text-gray-800 mb-1.5 tracking-tight">
          Patient Details
        </h2>
        <p className="text-xs md:text-sm text-gray-500">Please provide your contact information</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <InputField
            label="First Name"
            name="firstName"
            icon={User}
            value={data.patientDetails.firstName}
            required
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
          <InputField
            label="Last Name"
            name="lastName"
            icon={User}
            value={data.patientDetails.lastName}
            required
            focusedField={focusedField}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
        </div>

        <InputField
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          value={data.patientDetails.email}
          required
          focusedField={focusedField}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />

        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          icon={Phone}
          value={data.patientDetails.phone}
          required
          focusedField={focusedField}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />

        <InputField
          label="ID Number (Optional)"
          name="idNumber"
          icon={CreditCard}
          value={data.patientDetails.idNumber || ''}
          focusedField={focusedField}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />
      </div>

      {/* Reminder Preferences */}
      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-50 rounded-card">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-3 md:mb-4">Reminder Preferences</h3>
        <div className="space-y-2.5 md:space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.reminders.sms}
              onChange={(e) =>
                onChange({
                  reminders: { ...data.reminders, sms: e.target.checked },
                })
              }
              className="w-5 h-5 text-gray-700 rounded focus:ring-gray-500"
            />
            <span className="text-gray-700">SMS Reminder</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.reminders.whatsapp}
              onChange={(e) =>
                onChange({
                  reminders: { ...data.reminders, whatsapp: e.target.checked },
                })
              }
              className="w-5 h-5 text-gray-700 rounded focus:ring-gray-500"
            />
            <span className="text-gray-700">WhatsApp Reminder</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.reminders.calendar}
              onChange={(e) =>
                onChange({
                  reminders: { ...data.reminders, calendar: e.target.checked },
                })
              }
              className="w-5 h-5 text-gray-700 rounded focus:ring-gray-500"
            />
            <span className="text-gray-700">Add to Google Calendar</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default PatientDetails

