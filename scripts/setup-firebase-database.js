/**
 * Complete Firebase Database Setup Script
 * 
 * Instructions:
 * 1. Open your deployed site: https://dentist-prototype-7df60.web.app
 * 2. Open browser console (F12)
 * 3. Copy and paste this ENTIRE script
 * 4. Press Enter to run
 * 
 * This script will:
 * - Create practices collection (weltevreden, ruimsig)
 * - Create staff Firebase Auth accounts
 * - Create staff user documents in Firestore
 */

(async () => {
  console.log('🚀 Starting Firebase Database Setup...\n');

  try {
    // Import Firebase functions dynamically
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getAuth, createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    const { getFirestore, doc, setDoc, getDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
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
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized\n');

    // ============================================
    // STEP 1: Create Practices Collection
    // ============================================
    console.log('📋 Step 1: Creating practices collection...');
    
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
    
    console.log('✅ Practices collection setup complete!\n');

    // ============================================
    // STEP 2: Create Staff Accounts
    // ============================================
    console.log('👥 Step 2: Creating staff accounts...');
    
    const staffAccounts = [
      {
        email: 'admin@drnstaylor.co.za',
        password: 'Admin2025!',
        name: 'Admin User',
        role: 'admin',
        practices: ['ruimsig', 'weltevreden'],
      },
      {
        email: 'reception.ruimsig@drnstaylor.co.za',
        password: 'Reception2025!',
        name: 'Ruimsig Reception',
        role: 'reception',
        practices: ['ruimsig'],
      },
      {
        email: 'reception.weltevreden@drnstaylor.co.za',
        password: 'Reception2025!',
        name: 'Weltevreden Reception',
        role: 'reception',
        practices: ['weltevreden'],
      },
    ];
    
    for (const staff of staffAccounts) {
      try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, staff.email, staff.password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          name: staff.name,
          email: staff.email,
          role: staff.role,
          practices: staff.practices,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        console.log(`  ✅ Created: ${staff.email} (${staff.role}) - Practices: ${staff.practices.join(', ')}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`  ⏭️  User already exists: ${staff.email}`);
          
          // Try to update the user document if it exists
          try {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const existingUser = usersSnapshot.docs.find(doc => doc.data().email === staff.email);
            
            if (existingUser) {
              await setDoc(doc(db, 'users', existingUser.id), {
                ...existingUser.data(),
                name: staff.name,
                role: staff.role,
                practices: staff.practices,
                updatedAt: new Date(),
              }, { merge: true });
              console.log(`  ✅ Updated user document for: ${staff.email}`);
            }
          } catch (updateError) {
            console.log(`  ⚠️  Could not update user document for: ${staff.email}`);
          }
        } else {
          console.log(`  ❌ Error creating ${staff.email}: ${error.message}`);
        }
      }
    }
    
    console.log('✅ Staff accounts setup complete!\n');

    // ============================================
    // SUMMARY
    // ============================================
    console.log('🎉 Setup Complete!\n');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    staffAccounts.forEach(account => {
      console.log(`\n📧 Email: ${account.email}`);
      console.log(`🔑 Password: ${account.password}`);
      console.log(`👤 Role: ${account.role}`);
      console.log(`🏥 Practices: ${account.practices.join(', ')}`);
    });
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ You can now log in at: /staff/login');
    console.log('✅ Practices initialized: weltevreden, ruimsig');
    
    alert('✅ Firebase Database Setup Complete!\n\nCheck the console for login credentials.');
    
  } catch (error) {
    console.error('❌ Setup Error:', error);
    alert('❌ Setup failed. Check console for details.');
  }
})();

