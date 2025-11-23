/**
 * Firebase Connection Test Utility
 * 
 * Use this in your browser console or call it from a component to test Firebase connection
 */

import { db } from '../config/firebase'
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Firebase Connection...')
    
    // Test 1: Check if db is initialized
    if (!db) {
      console.error('❌ Firestore database not initialized')
      return false
    }
    console.log('✅ Firestore database initialized')
    
    // Test 2: Try to read from Firestore
    console.log('📖 Testing Firestore read...')
    const testCollection = collection(db, 'test')
    const snapshot = await getDocs(testCollection)
    console.log(`✅ Firestore read successful. Found ${snapshot.size} test documents`)
    
    // Test 3: Try to write to Firestore
    console.log('✍️ Testing Firestore write...')
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: Timestamp.now(),
      test: true,
    })
    console.log(`✅ Firestore write successful. Document ID: ${testDoc.id}`)
    
    console.log('🎉 All Firebase tests passed!')
    return true
  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error code:', (error as any).code)
    }
    return false
  }
}

// Test bookings collection
export async function testBookingsCollection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Bookings Collection...')
    
    const bookingsRef = collection(db, 'bookings')
    const snapshot = await getDocs(bookingsRef)
    console.log(`✅ Bookings collection accessible. Found ${snapshot.size} bookings`)
    
    return true
  } catch (error) {
    console.error('❌ Bookings collection test failed:', error)
    return false
  }
}

// Test patients collection
export async function testPatientsCollection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Patients Collection...')
    
    const patientsRef = collection(db, 'patients')
    const snapshot = await getDocs(patientsRef)
    console.log(`✅ Patients collection accessible. Found ${snapshot.size} patients`)
    
    return true
  } catch (error) {
    console.error('❌ Patients collection test failed:', error)
    return false
  }
}

