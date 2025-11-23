import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, DollarSign, FileText, History, CreditCard, Edit2, Save } from 'lucide-react'
import { format } from 'date-fns'
import { Patient, PatientHistory, PaymentRecord } from '../../types'

interface PatientProfileModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
  history?: PatientHistory[]
  payments?: PaymentRecord[]
  onUpdate?: (patient: Patient) => void
}

const PatientProfileModal = ({ isOpen, onClose, patient, history = [], payments = [], onUpdate }: PatientProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    if (patient) {
      setEditedPatient({ ...patient })
    }
  }, [patient])

  if (!patient || !editedPatient) return null

  const handleSave = () => {
    if (onUpdate && editedPatient) {
      onUpdate(editedPatient)
    }
    setIsEditing(false)
  }

  const totalSpent = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalDeposits = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.deposit, 0)

  const completedVisits = history.filter(h => h.status === 'completed').length
  const noShows = history.filter(h => h.status === 'no-show').length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">
                    {editedPatient.firstName} {editedPatient.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Patient Profile</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="p-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                    title="Save changes"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Edit patient"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{completedVisits}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed Visits</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{noShows}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">No-Shows</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">R{totalSpent.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">R{totalDeposits.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-display font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedPatient.email}
                        onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{editedPatient.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedPatient.phone}
                        onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{editedPatient.phone}</span>
                      </div>
                    )}
                  </div>
                  {editedPatient.idNumber && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">ID Number</label>
                      <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span>{editedPatient.idNumber}</span>
                      </div>
                    </div>
                  )}
                  {editedPatient.medicalAid && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Medical Aid</label>
                      <div className="text-gray-800 dark:text-gray-200">
                        <span>{editedPatient.medicalAid}</span>
                        {editedPatient.medicalAidNumber && (
                          <span className="text-gray-500 dark:text-gray-400 ml-2">({editedPatient.medicalAidNumber})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="card p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-display font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Notes</span>
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedPatient.notes || ''}
                    onChange={(e) => setEditedPatient({ ...editedPatient, notes: e.target.value })}
                    rows={4}
                    className="input-field"
                    placeholder="Add patient notes, medical history, or special instructions..."
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {editedPatient.notes || 'No notes available'}
                  </p>
                )}
              </div>

              {/* Treatment History */}
              <div className="card p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-display font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Treatment History ({history.length})</span>
                </h3>
                {history.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {history.map((visit) => (
                      <div key={visit.id} className="border-l-4 border-l-gray-300 dark:border-l-gray-600 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-100">{visit.service}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(visit.date), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {visit.dentist} • R{visit.amount.toLocaleString()}
                        </div>
                        {visit.treatmentNotes && (
                          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic">
                            {visit.treatmentNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No treatment history available</p>
                )}
              </div>

              {/* Payment History */}
              <div className="card p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-display font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Payment History ({payments.length})</span>
                </h3>
                {payments.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100">
                            R{payment.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(payment.date), 'MMM d, yyyy')} • {payment.method}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {payment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No payment history available</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PatientProfileModal

