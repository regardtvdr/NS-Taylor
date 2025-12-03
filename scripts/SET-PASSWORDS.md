# Set Passwords for Firebase Auth Users

Since the Firebase Auth users were created manually, you need to set passwords for them in the Firebase Console.

## Steps:

### 1. Go to Firebase Authentication Console
Open: https://console.firebase.google.com/project/dentist-prototype-7df60/authentication/users

### 2. For Each User:

#### Admin User (`admin@drnstaylor.co.za`)
1. Find the user with email `admin@drnstaylor.co.za` (UID: `CieaLdzrgKWKoN7fMvNJWA0g6fD2`)
2. Click on the user to open details
3. Click the **"Reset password"** button (or look for password settings)
4. Enter a new password (e.g., `Admin2025!`)
5. Click **"Reset password"** or **"Save"**

#### Weltevreden Reception (`reception.weltevreden@drnstaylor.co.za`)
1. Find the user with email `reception.weltevreden@drnstaylor.co.za` (UID: `bqux0j14eHTNRld0dZvv54nNTnF3`)
2. Click on the user to open details
3. Click the **"Reset password"** button
4. Enter a new password (e.g., `Reception2025!`)
5. Click **"Reset password"** or **"Save"**

#### Ruimsig Reception (`reception.ruimsig@drnstaylor.co.za`)
1. Find the user with email `reception.ruimsig@drnstaylor.co.za` (UID: `P6CBwLznn1bYMkV9fpNZ0zwUA0o2`)
2. Click on the user to open details
3. Click the **"Reset password"** button
4. Enter a new password (e.g., `Reception2025!`)
5. Click **"Reset password"** or **"Save"**

## Alternative: Use Firebase Admin SDK (Advanced)

If you have Firebase Admin SDK credentials, you can use the `setup-firebase-admin.js` script, but this requires:
- Node.js installed
- Firebase service account JSON file
- Running: `node scripts/setup-firebase-admin.js`

## Recommended Passwords:

- **Admin**: `Admin2025!`
- **Weltevreden Reception**: `Reception2025!`
- **Ruimsig Reception**: `Reception2025!`

**Note**: Make sure to share these passwords securely with the staff members!

