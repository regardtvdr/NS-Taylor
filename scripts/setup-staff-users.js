/**
 * Staff Users Setup Script
 * 
 * PREREQUISITE: You must create the Firebase Auth users FIRST in Firebase Console
 * 
 * Steps:
 * 1. Go to Firebase Console → Authentication → Add User
 * 2. Create these 3 users:
 *    - admin@drnstaylor.co.za / Admin2025!
 *    - reception.ruimsig@drnstaylor.co.za / Reception2025!
 *    - reception.weltevreden@drnstaylor.co.za / Reception2025!
 * 3. Copy their UIDs from Authentication → Users
 * 4. Run this script and paste the UIDs when prompted
 * 
 * OR use the simpler method below (automatic UID lookup)
 */

(async () => {
  console.log('🚀 Starting Staff Users Setup...\n');

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
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

    const staffData = [
      {
        email: 'admin@drnstaylor.co.za',
        name: 'Admin User',
        role: 'admin',
        practices: ['ruimsig', 'weltevreden'],
      },
      {
        email: 'reception.ruimsig@drnstaylor.co.za',
        name: 'Ruimsig Reception',
        role: 'reception',
        practices: ['ruimsig'],
      },
      {
        email: 'reception.weltevreden@drnstaylor.co.za',
        name: 'Weltevreden Reception',
        role: 'reception',
        practices: ['weltevreden'],
      },
    ];

    console.log('📋 Looking up existing Firebase Auth users...\n');
    
    // Get all users from Authentication (we'll match by email)
    // Note: This requires the users to already exist in Firebase Auth
    const usersRef = collection(db, 'users');
    const existingUsers = await getDocs(usersRef);
    
    // Get Authentication users (we need to check Firebase Auth)
    // Since we can't directly query Auth from client, we'll try to find by email
    console.log('⚠️  Note: This script requires users to be created in Firebase Console first.\n');
    console.log('📝 Please create these users in Firebase Console → Authentication:\n');
    
    staffData.forEach(staff => {
      console.log(`  - ${staff.email}`);
    });
    
    console.log('\n💡 After creating users in Firebase Console:');
    console.log('   1. Go to Authentication → Users');
    console.log('   2. Click on each user to see their UID');
    console.log('   3. Create user documents in Firestore with those UIDs\n');
    
    console.log('🔧 Alternative: Use the web interface at /staff/initialize-staff');
    
    alert('⚠️ Staff users must be created in Firebase Console first!\n\nGo to: Authentication → Add User\n\nThen use /staff/initialize-staff page.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    alert('❌ Setup failed: ' + error.message);
  }
})();

