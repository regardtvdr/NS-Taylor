/**
 * Set Passwords for Firebase Auth Users
 * Run this from terminal: node scripts/set-passwords.js
 * 
 * This uses Firebase Admin SDK which has full permissions to set passwords
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
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

const auth = admin.auth();

// Staff accounts with their UIDs and passwords
const staffAccounts = [
  {
    uid: 'bqux0j14eHTNRld0dZvv54nNTnF3',
    email: 'reception.weltevreden@drnstaylor.co.za',
    password: 'Reception2025!',
    name: 'Weltevreden Reception',
  },
  {
    uid: 'P6CBwLznn1bYMkV9fpNZ0zwUA0o2',
    email: 'reception.ruimsig@drnstaylor.co.za',
    password: 'Reception2025!',
    name: 'Ruimsig Reception',
  },
  {
    uid: 'CieaLdzrgKWKoN7fMvNJWA0g6fD2',
    email: 'admin@drnstaylor.co.za',
    password: 'Admin2025!',
    name: 'Admin User',
  },
];

async function setPasswords() {
  console.log('🔐 Setting passwords for staff accounts...\n');
  
  for (const account of staffAccounts) {
    try {
      // Update the user to set password
      await auth.updateUser(account.uid, {
        password: account.password,
        email: account.email,
        emailVerified: true, // Mark email as verified
      });
      
      console.log(`✅ Password set for: ${account.email} (${account.name})`);
      console.log(`   Password: ${account.password}\n`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.error(`❌ User not found: ${account.email} (UID: ${account.uid})`);
        console.error('   Make sure the user exists in Firebase Authentication\n');
      } else {
        console.error(`❌ Error setting password for ${account.email}: ${error.message}\n`);
      }
    }
  }
  
  console.log('\n✅ Password setup complete!');
  console.log('\n📝 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📧 admin@drnstaylor.co.za');
  console.log('🔑 Admin2025!');
  console.log('👤 Admin (Both practices)');
  console.log('\n📧 reception.weltevreden@drnstaylor.co.za');
  console.log('🔑 Reception2025!');
  console.log('👤 Reception (Weltevreden only)');
  console.log('\n📧 reception.ruimsig@drnstaylor.co.za');
  console.log('🔑 Reception2025!');
  console.log('👤 Reception (Ruimsig only)');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the script
setPasswords()
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

