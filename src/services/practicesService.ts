import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface Practice {
  id: string
  name: string
  address: string
  phone: string
  email: string
  timezone: string
  registrationNumber?: string
  practiceNumber?: string
  workingHours: {
    monday: { open: string; close: string } | null
    tuesday: { open: string; close: string } | null
    wednesday: { open: string; close: string } | null
    thursday: { open: string; close: string } | null
    friday: { open: string; close: string } | null
    saturday: { open: string; close: string } | null
    sunday: { open: string; close: string } | null
  }
  createdAt?: Date
  updatedAt?: Date
}

// Default practices data for initialization
export const DEFAULT_PRACTICES: Omit<Practice, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'weltevreden',
    name: 'Weltevreden Park',
    address: 'The Gables Unit no.2, 879 Tennis Rd, Weltevreden Park Ext 25, 1709',
    phone: '011 679 2961',
    email: 'admin@dentaloffices.co.za',
    timezone: 'Africa/Johannesburg',
    registrationNumber: '1995/0136',
    practiceNumber: '5446899',
    workingHours: {
      monday: { open: '08:00', close: '16:30' },
      tuesday: { open: '08:00', close: '16:30' },
      wednesday: { open: '08:00', close: '16:30' },
      thursday: { open: '08:00', close: '16:30' },
      friday: { open: '08:00', close: '16:30' },
      saturday: null,
      sunday: null,
    },
  },
  {
    id: 'ruimsig',
    name: 'Ruimsig',
    address: 'Unit 5, Ruimsig Country Office Park, 129 Hole In One St, Ruimsig, 1724',
    phone: '010 100 8410',
    email: 'info@drnstaylor.co.za',
    timezone: 'Africa/Johannesburg',
    workingHours: {
      monday: { open: '08:00', close: '16:30' },
      tuesday: { open: '08:00', close: '16:30' },
      wednesday: { open: '08:00', close: '16:30' },
      thursday: { open: '08:00', close: '16:30' },
      friday: { open: '08:00', close: '16:30' },
      saturday: null,
      sunday: null,
    },
  },
]

export const practicesService = {
  // Get all practices
  async getAll(): Promise<Practice[]> {
    const practicesRef = collection(db, 'practices')
    const snapshot = await getDocs(practicesRef)
    
    if (snapshot.empty) {
      // Initialize with default practices if collection is empty
      await this.initializeDefaults()
      return DEFAULT_PRACTICES.map(p => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Practice[]
  },

  // Get a single practice by ID
  async getById(id: string): Promise<Practice | null> {
    const practiceRef = doc(db, 'practices', id)
    const snapshot = await getDoc(practiceRef)
    
    if (!snapshot.exists()) {
      return null
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Practice
  },

  // Initialize default practices
  async initializeDefaults(): Promise<void> {
    for (const practice of DEFAULT_PRACTICES) {
      const practiceRef = doc(db, 'practices', practice.id)
      const existing = await getDoc(practiceRef)
      
      if (!existing.exists()) {
        await setDoc(practiceRef, {
          ...practice,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        console.log(`Created practice: ${practice.name}`)
      }
    }
  },

  // Update a practice
  async update(id: string, data: Partial<Practice>): Promise<void> {
    const practiceRef = doc(db, 'practices', id)
    await updateDoc(practiceRef, {
      ...data,
      updatedAt: new Date(),
    })
  },

  // Get practice name by ID (for display purposes)
  getPracticeName(practiceId: string): string {
    const practice = DEFAULT_PRACTICES.find(p => p.id === practiceId)
    return practice?.name || practiceId
  },
}

