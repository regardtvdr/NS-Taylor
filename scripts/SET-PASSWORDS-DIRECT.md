# Set Passwords Directly in Firebase Console

If you only see "Send a password reset email", you need to add the Email/Password provider first.

## Steps to Add Email/Password Provider and Set Password:

### For Each User:

1. **Click on the user** (e.g., `reception.ruimsig@drnstaylor.co.za`)

2. **Look for "Add provider" or "Link account" button** (usually at the bottom of the user details)

3. **Click "Add provider"** → Select **"Email/Password"**

4. **Enter the email** (should already be filled: `reception.ruimsig@drnstaylor.co.za`)

5. **Enter a password** (e.g., `Reception2025!`)

6. **Click "Add"** or **"Save"**

### Alternative: If you can't add provider directly

You can use the Firebase Admin SDK script, but the easiest way is:

1. **Go to Authentication → Users**
2. **Click the three dots (⋮) next to the user**
3. **Select "Reset password"** - this will send them an email to set their password
4. **OR** look for "Add sign-in method" or "Providers" section

### Recommended Passwords:

- **Admin** (`admin@drnstaylor.co.za`): `Admin2025!`
- **Weltevreden Reception** (`reception.weltevreden@drnstaylor.co.za`): `Reception2025!`
- **Ruimsig Reception** (`reception.ruimsig@drnstaylor.co.za`): `Reception2025!`

## If "Add provider" doesn't work:

You can also create a simple Node.js script using Firebase Admin SDK to set passwords directly. Let me know if you want me to create that script!

