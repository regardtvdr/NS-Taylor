# Firebase Database Setup Instructions

## Quick Setup (Browser Console)

### Step 1: Open Your Site
1. Go to: https://dentist-prototype-7df60.web.app
2. Open browser console:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

### Step 2: Run Setup Script
1. Open the file: `scripts/setup-firebase-database.js`
2. Copy the **ENTIRE** contents
3. Paste into the browser console
4. Press `Enter`
5. Wait for completion (you'll see progress messages)

### Step 3: Verify Setup
The script will:
- ✅ Create `weltevreden` and `ruimsig` practice documents
- ✅ Create 3 staff accounts with Firebase Auth
- ✅ Create user documents in Firestore with practice assignments
- ✅ Display login credentials in the console

## What Gets Created

### Practices Collection
- **weltevreden** - Weltevreden Park practice
- **ruimsig** - Ruimsig practice

### Staff Accounts
| Email | Password | Role | Practices |
|-------|----------|------|-----------|
| `admin@drnstaylor.co.za` | `Admin2025!` | Admin | Both |
| `reception.ruimsig@drnstaylor.co.za` | `Reception2025!` | Reception | Ruimsig only |
| `reception.weltevreden@drnstaylor.co.za` | `Reception2025!` | Reception | Weltevreden only |

## Alternative: Use the Web Interface

### Option 1: Initialize Practices
1. Go to: `/staff/initialize`
2. Click "Initialize Practices"

### Option 2: Initialize Staff
1. Go to: `/staff/initialize-staff`
2. Click "Initialize Staff Accounts"

## Troubleshooting

### "User already exists" error
- This is normal if you've run the script before
- The script will update existing user documents
- You can still log in with the existing account

### "Permission denied" error
- Make sure you're logged into Firebase Console with the correct account
- Check that Firestore rules are deployed
- Try running the script again

### Script doesn't run
- Make sure you copied the ENTIRE script (including the `(async () => { ... })();` wrapper)
- Check browser console for errors
- Try refreshing the page and running again

## After Setup

1. **Test Login**: Go to `/staff/login` and log in with one of the accounts
2. **Verify Filtering**: Each staff member should only see bookings for their assigned practice(s)
3. **Admin Access**: Admin account should see bookings from both practices

## Security Notes

⚠️ **Important**: Change the default passwords after initial setup!

The default passwords are:
- Admin: `Admin2025!`
- Reception: `Reception2025!`

You can change passwords in Firebase Console → Authentication → Users

