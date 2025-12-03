# Firebase Initialization Scripts

## Initialize Practices Collection

### Option 1: Use the Admin Page (Recommended)
1. Navigate to `/staff/initialize` on your deployed site
2. Click "Initialize Practices" button
3. Done!

### Option 2: Browser Console Script
1. Open your deployed site in a browser
2. Open browser console (F12 or Ctrl+Shift+J)
3. Copy the contents of `initialize-practices.js`
4. Paste into console and press Enter

### Option 3: Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Create collection: `practices`
5. Add documents manually (see `practicesService.ts` for structure)

## What Gets Created

- **weltevreden** - Weltevreden Park practice
- **ruimsig** - Ruimsig practice

Both practices include:
- Contact information (address, phone, email)
- Working hours (Monday-Friday: 8:00 AM - 4:30 PM)
- Timezone settings
- Registration/practice numbers (Weltevreden only)

## Notes

- Scripts are idempotent (safe to run multiple times)
- Only creates practices if they don't already exist
- No data will be overwritten if practices already exist

