/**
 * Quick Practices Setup Script
 * Run: node scripts/run-practices-setup.js
 * 
 * This uses the Firebase client SDK but requires the rules to allow writes
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDT1cUeebTk8iJi5Fdkx476YXRHT4OAWXQ',
  authDomain: 'dentist-prototype-7df60.firebaseapp.com',
  projectId: 'dentist-prototype-7df60',
  storageBucket: 'dentist-prototype-7df60.firebasestorage.app',
  messagingSenderId: '524992999704',
  appId: '1:524992999704:web:edd35820d194cf3f9cee6d',
  measurementId: 'G-68P20X90L5',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const practices = [
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function setup() {
  console.log('🚀 Setting up practices...\n');
  
  for (const practice of practices) {
    const practiceRef = doc(db, 'practices', practice.id);
    const existing = await getDoc(practiceRef);
    
    if (!existing.exists()) {
      await setDoc(practiceRef, practice);
      console.log(`✅ Created: ${practice.name}`);
    } else {
      console.log(`⏭️  Exists: ${practice.name}`);
    }
  }
  
  console.log('\n✅ Done!');
}

setup().catch(console.error);

