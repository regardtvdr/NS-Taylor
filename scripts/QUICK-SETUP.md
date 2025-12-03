# Quick Setup Guide

## The Problem
Creating Firebase Auth users from browser console requires special permissions. The easiest way is to use Firebase Console.

## Easiest Method: Use Web Interface

### Step 1: Enable Email/Password Auth
1. Go to: https://console.firebase.google.com/project/dentist-prototype-7df60/authentication/providers
2. Click "Email/Password"
3. Enable it (toggle ON)
4. Click "Save"

### Step 2: Initialize Practices (Browser Console)
1. Open: https://dentist-prototype-7df60.web.app
2. Open console (F12)
3. Copy and paste this script:

```javascript
(async () => {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
  const { getFirestore, doc, setDoc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
  
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
      console.log(`✅ Created: ${practice.name}`);
    } else {
      console.log(`⏭️  Exists: ${practice.name}`);
    }
  }
  
  alert('✅ Practices created!');
})();
```

### Step 3: Create Staff Users (Firebase Console)
1. Go to: https://console.firebase.google.com/project/dentist-prototype-7df60/authentication/users
2. Click "Add user"
3. Create these 3 users:

**User 1:**
- Email: `admin@drnstaylor.co.za`
- Password: `Admin2025!`
- ✅ Email verified

**User 2:**
- Email: `reception.ruimsig@drnstaylor.co.za`
- Password: `Reception2025!`
- ✅ Email verified

**User 3:**
- Email: `reception.weltevreden@drnstaylor.co.za`
- Password: `Reception2025!`
- ✅ Email verified

### Step 4: Create User Documents (Browser Console)
After creating the Auth users, copy their UIDs and run this script:

```javascript
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
  
  // REPLACE THESE UIDs WITH THE ONES FROM FIREBASE CONSOLE
  const staffUsers = [
    {
      uid: 'PASTE_ADMIN_UID_HERE', // Get from Authentication → Users → Click user → Copy UID
      email: 'admin@drnstaylor.co.za',
      name: 'Admin User',
      role: 'admin',
      practices: ['ruimsig', 'weltevreden'],
    },
    {
      uid: 'PASTE_RUIMSIG_UID_HERE',
      email: 'reception.ruimsig@drnstaylor.co.za',
      name: 'Ruimsig Reception',
      role: 'reception',
      practices: ['ruimsig'],
    },
    {
      uid: 'PASTE_WELTEVREDEN_UID_HERE',
      email: 'reception.weltevreden@drnstaylor.co.za',
      name: 'Weltevreden Reception',
      role: 'reception',
      practices: ['weltevreden'],
    },
  ];
  
  for (const staff of staffUsers) {
    const userRef = doc(db, 'users', staff.uid);
    await setDoc(userRef, {
      name: staff.name,
      email: staff.email,
      role: staff.role,
      practices: staff.practices,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created user doc: ${staff.email}`);
  }
  
  alert('✅ User documents created!');
})();
```

## Even Easier: Use Web Pages

1. **Practices**: Go to `/staff/initialize` → Click button
2. **Staff**: Go to `/staff/initialize-staff` → Click button (after enabling Email/Password auth)

The web pages handle everything automatically!

