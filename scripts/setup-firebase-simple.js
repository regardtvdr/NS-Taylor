/**
 * SIMPLE Firebase Setup Script (Practices Only)
 * 
 * This script only creates practices (which don't require special permissions).
 * For staff users, you'll need to create them in Firebase Console first.
 * 
 * Instructions:
 * 1. Open: https://dentist-prototype-7df60.web.app
 * 2. Open browser console (F12)
 * 3. Copy and paste this ENTIRE script
 * 4. Press Enter
 */

(async () => {
  console.log('🚀 Starting Firebase Practices Setup...\n');

  try {
    // Import Firebase functions
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
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
    
    console.log('✅ Firebase initialized\n');

    // Create Practices
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
        console.log(`  ✅ Created practice: ${practice.name}`);
      } else {
        console.log(`  ⏭️  Practice already exists: ${practice.name}`);
      }
    }
    
    console.log('\n✅ Practices setup complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Go to Firebase Console → Authentication');
    console.log('2. Enable "Email/Password" provider if not enabled');
    console.log('3. Create staff users manually (see instructions below)');
    console.log('4. Then run the staff setup script');
    
    alert('✅ Practices created!\n\nNext: Create staff users in Firebase Console, then run staff setup.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Setup failed: ' + error.message);
  }
})();

