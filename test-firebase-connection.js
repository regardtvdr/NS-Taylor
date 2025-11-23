/**
 * Quick test script to verify Firebase connection
 * Run this with: node test-firebase-connection.js
 * 
 * Make sure you have firebase-admin installed: npm install firebase-admin
 * Or use the web SDK from your browser console
 */

// For browser console testing, paste this in your browser console after loading your app:

console.log('Testing Firebase Connection...')

// Test 1: Check if Firebase is initialized
import { db } from './src/config/firebase.js'
import { collection, addDoc, getDocs } from 'firebase/firestore'

async function testFirebaseConnection() {
  try {
    console.log('✅ Firebase initialized')
    
    // Test 2: Try to read from Firestore
    console.log('Testing Firestore read...')
    const bookingsRef = collection(db, 'bookings')
    const snapshot = await getDocs(bookingsRef)
    console.log(`✅ Firestore read successful. Found ${snapshot.size} documents`)
    
    // Test 3: Try to write to Firestore (optional - creates a test document)
    console.log('Testing Firestore write...')
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: new Date().toISOString()
    })
    console.log(`✅ Firestore write successful. Document ID: ${testDoc.id}`)
    
    console.log('🎉 All Firebase tests passed!')
    return true
  } catch (error) {
    console.error('❌ Firebase test failed:', error)
    return false
  }
}

// Uncomment to run:
// testFirebaseConnection()

