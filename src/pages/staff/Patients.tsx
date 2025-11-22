import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Phone, Mail, Calendar, Clock } from 'lucide-react'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  lastVisit: string
  nextAppointment: string | null
  totalVisits: number
  totalSpent: number
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const patients: Patient[] = [
    {
      id: 'P-001',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+27 82 123 4567',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      totalVisits: 5,
      totalSpent: 3250,
    },
    {
      id: 'P-002',
      name: 'James Thompson',
      email: 'james.thompson@email.com',
      phone: '+27 83 234 5678',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-16',
      totalVisits: 3,
      totalSpent: 1950,
    },
    {
      id: 'P-003',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+27 84 345 6789',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-02-17',
      totalVisits: 8,
      totalSpent: 5200,
    },
    {
      id: 'P-004',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+27 85 456 7890',
      lastVisit: '2024-01-25',
      nextAppointment: '2024-02-18',
      totalVisits: 2,
      totalSpent: 1200,
    },
    {
      id: 'P-005',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+27 86 567 8901',
      lastVisit: '2024-01-30',
      nextAppointment: null,
      totalVisits: 4,
      totalSpent: 2600,
    },
  ]

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-2">
            Patient Directory
          </h1>
          <p className="text-gray-600">Search and manage patient records</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 input-field"
            />
          </div>
        </motion.div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <span className="text-xs font-mono text-gray-500">{patient.id}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">{patient.name}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
                {patient.nextAppointment && (
                  <div className="flex items-center space-x-3 text-sm text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Visits</p>
                  <p className="text-lg font-semibold text-gray-800">{patient.totalVisits}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-gray-800">R{patient.totalSpent}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-gray-500">No patients found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Patients

