/**
 * Firebase Admin Setup Script
 * Run this from terminal: node scripts/setup-firebase-admin.js
 * 
 * This uses Firebase Admin SDK which has full permissions
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// You'll need to download a service account key from Firebase Console
// Go to: Project Settings → Service Accounts → Generate New Private Key
// Save it as 'serviceAccountKey.json' in the project root

try {
  // Try to initialize with service account key
  const serviceAccount = require('../serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase Admin initialized\n');
} catch (error) {
  console.error('❌ Error: Could not find serviceAccountKey.json');
  console.error('📝 Please download it from Firebase Console:');
  console.error('   1. Go to: https://console.firebase.google.com/project/dentist-prototype-7df60/settings/serviceaccounts/adminsdk');
  console.error('   2. Click "Generate New Private Key"');
  console.error('   3. Save as "serviceAccountKey.json" in project root');
  console.error('   4. Run this script again\n');
  process.exit(1);
}

const db = admin.firestore();

async function setupPractices() {
  console.log('📋 Setting up practices collection...\n');
  
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];
  
  for (const practice of practices) {
    const practiceRef = db.collection('practices').doc(practice.id);
    const existing = await practiceRef.get();
    
    if (!existing.exists) {
      await practiceRef.set(practice);
      console.log(`  ✅ Created practice: ${practice.name}`);
    } else {
      console.log(`  ⏭️  Practice already exists: ${practice.name}`);
    }
  }
  
  console.log('\n✅ Practices setup complete!\n');
}

async function setupStaffUsers() {
  console.log('👥 Setting up staff users...\n');
  
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
      const userRecord = await admin.auth().createUser({
        email: staff.email,
        password: staff.password,
        emailVerified: true,
      });
      
      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        practices: staff.practices,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      console.log(`  ✅ Created: ${staff.email} (${staff.role}) - Practices: ${staff.practices.join(', ')}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`  ⏭️  User already exists: ${staff.email}`);
        
        // Try to get the user and update Firestore doc
        try {
          const userRecord = await admin.auth().getUserByEmail(staff.email);
          await db.collection('users').doc(userRecord.uid).set({
            name: staff.name,
            email: staff.email,
            role: staff.role,
            practices: staff.practices,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }, { merge: true });
          console.log(`  ✅ Updated user document for: ${staff.email}`);
        } catch (updateError) {
          console.log(`  ⚠️  Could not update user document for: ${staff.email}`);
        }
      } else {
        console.log(`  ❌ Error creating ${staff.email}: ${error.message}`);
      }
    }
  }
  
  console.log('\n✅ Staff users setup complete!\n');
}

async function main() {
  try {
    console.log('🚀 Starting Firebase Database Setup...\n');
    
    await setupPractices();
    await setupStaffUsers();
    
    console.log('🎉 Setup Complete!\n');
    console.log('📝 Login Credentials:');
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
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup Error:', error);
    process.exit(1);
  }
}

main();

