/**
 * Standalone script to initialize practices collection in Firestore
 * 
 * Usage:
 * 1. Open your deployed site in a browser
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to run
 * 
 * OR run this in Node.js with Firebase Admin SDK
 */

// Browser Console Version
// Copy everything below this line and paste into browser console

(async () => {
  try {
    console.log('🚀 Starting practices initialization...');
    
    // Import Firebase functions dynamically
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Your Firebase config
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
    
    for (const practice of practices) {
      const practiceRef = doc(db, 'practices', practice.id);
      const existing = await getDoc(practiceRef);
      
      if (!existing.exists()) {
        await setDoc(practiceRef, practice);
        console.log(`✅ Created practice: ${practice.name}`);
      } else {
        console.log(`⏭️  Practice already exists: ${practice.name}`);
      }
    }
    
    console.log('✅ Done! Practices initialized.');
    alert('✅ Practices initialized successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Error initializing practices: ' + error.message);
  }
})();

