/**
 * Create User Documents Script
 * Run this in browser console with your site open
 */

(async () => {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
  const { getFirestore, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
  
  const app = initializeApp({
    apiKey: 'AIzaSyDT1cUeebTk8iJi5Fdkx476YXRHT4OAWXQ',
    authDomain: 'dentist-prototype-7df60.firebaseapp.com',
    projectId: 'dentist-prototype-7df60',
    storageBucket: 'dentist-prototype-7df60.firebasestorage.app',
    messagingSenderId: '524992999704',
    appId: '1:524992999704:web:edd35820d194cf3f9cee6d',
    measurementId: 'G-68P20X90L5',
  });
  
  const db = getFirestore(app);
  
  const staffUsers = [
    {
      uid: 'bqux0j14eHTNRld0dZvv54nNTnF3',
      email: 'reception.weltevreden@drnstaylor.co.za',
      name: 'Weltevreden Reception',
      role: 'reception',
      practices: ['weltevreden'],
    },
    {
      uid: 'P6CBwLznn1bYMkV9fpNZ0zwUA0o2',
      email: 'reception.ruimsig@drnstaylor.co.za',
      name: 'Ruimsig Reception',
      role: 'reception',
      practices: ['ruimsig'],
    },
    {
      uid: 'CieaLdzrgKWKoN7fMvNJWA0g6fD2',
      email: 'admin@drnstaylor.co.za',
      name: 'Admin User',
      role: 'admin',
      practices: ['ruimsig', 'weltevreden'],
    },
  ];
  
  console.log('🚀 Creating user documents...\n');
  
  for (const staff of staffUsers) {
    try {
      const userRef = doc(db, 'users', staff.uid);
      await setDoc(userRef, {
        name: staff.name,
        email: staff.email,
        role: staff.role,
        practices: staff.practices,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created: ${staff.email} (${staff.role}) - Practices: ${staff.practices.join(', ')}`);
    } catch (error) {
      console.log(`❌ Error creating ${staff.email}: ${error.message}`);
    }
  }
  
  console.log('\n✅ User documents setup complete!');
  console.log('\n📝 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📧 admin@drnstaylor.co.za');
  console.log('🔑 Admin2025!');
  console.log('👤 Admin (Both practices)');
  console.log('\n📧 reception.ruimsig@drnstaylor.co.za');
  console.log('🔑 Reception2025!');
  console.log('👤 Reception (Ruimsig only)');
  console.log('\n📧 reception.weltevreden@drnstaylor.co.za');
  console.log('🔑 Reception2025!');
  console.log('👤 Reception (Weltevreden only)');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  alert('✅ User documents created!\n\nYou can now log in at /staff/login');
})();

