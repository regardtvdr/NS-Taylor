import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Firebase configuration
// Using your Firebase project credentials
const firebaseConfig = {
  apiKey: 'AIzaSyDT1cUeebTk8iJi5Fdkx476YXRHT4OAWXQ',
  authDomain: 'dentist-prototype-7df60.firebaseapp.com',
  projectId: 'dentist-prototype-7df60',
  storageBucket: 'dentist-prototype-7df60.firebasestorage.app',
  messagingSenderId: '524992999704',
  appId: '1:524992999704:web:edd35820d194cf3f9cee6d',
  measurementId: 'G-68P20X90L5',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Analytics (only in browser environment)
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}
export { analytics }

export default app

