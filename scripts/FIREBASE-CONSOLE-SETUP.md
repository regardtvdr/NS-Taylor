# Firebase Console Setup Guide
## Copy & Paste Data for Manual Setup

---

## STEP 1: Create Practices Collection

### Collection: `practices`

#### Document 1: `weltevreden`

**Document ID:** `weltevreden`

**Fields (add one by one):**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Weltevreden Park` |
| `address` | string | `The Gables Unit no.2, 879 Tennis Rd, Weltevreden Park Ext 25, 1709` |
| `phone` | string | `011 679 2961` |
| `email` | string | `admin@dentaloffices.co.za` |
| `timezone` | string | `Africa/Johannesburg` |
| `registrationNumber` | string | `1995/0136` |
| `practiceNumber` | string | `5446899` |
| `workingHours` | map | (see below) |
| `createdAt` | timestamp | (click "Set" and use current time) |
| `updatedAt` | timestamp | (click "Set" and use current time) |

**For `workingHours` map field:**
Click "Add field" → Name: `workingHours` → Type: `map` → Then add these nested fields:

| Field Name | Type | Value |
|------------|------|-------|
| `monday` | map | (see below) |
| `tuesday` | map | (see below) |
| `wednesday` | map | (see below) |
| `thursday` | map | (see below) |
| `friday` | map | (see below) |
| `saturday` | null | (select "null" type) |
| `sunday` | null | (select "null" type) |

**For each day (monday, tuesday, wednesday, thursday, friday):**
Click into the day's map → Add nested fields:

| Field Name | Type | Value |
|------------|------|-------|
| `open` | string | `08:00` |
| `close` | string | `16:30` |

---

#### Document 2: `ruimsig`

**Document ID:** `ruimsig`

**Fields (add one by one):**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Ruimsig` |
| `address` | string | `Unit 5, Ruimsig Country Office Park, 129 Hole In One St, Ruimsig, 1724` |
| `phone` | string | `010 100 8410` |
| `email` | string | `info@drnstaylor.co.za` |
| `timezone` | string | `Africa/Johannesburg` |
| `workingHours` | map | (same structure as weltevreden above) |
| `createdAt` | timestamp | (click "Set" and use current time) |
| `updatedAt` | timestamp | (click "Set" and use current time) |

**Note:** Ruimsig does NOT have `registrationNumber` or `practiceNumber` fields.

---

## STEP 2: Create Staff Firebase Auth Accounts

### Go to: Authentication → Users → Add User

Create these 3 users one by one:

#### User 1: Admin
- **Email:** `admin@drnstaylor.co.za`
- **Password:** `Admin2025!`
- **Email verified:** ✅ (check the box)

#### User 2: Ruimsig Reception
- **Email:** `reception.ruimsig@drnstaylor.co.za`
- **Password:** `Reception2025!`
- **Email verified:** ✅ (check the box)

#### User 3: Weltevreden Reception
- **Email:** `reception.weltevreden@drnstaylor.co.za`
- **Password:** `Reception2025!`
- **Email verified:** ✅ (check the box)

**Important:** After creating each user, copy their **UID** (User ID) - you'll need it for the next step!

---

## STEP 3: Create User Documents in Firestore

### Collection: `users`

For each staff member, create a document using their Firebase Auth UID as the Document ID.

#### Document 1: Admin User

**Document ID:** (Use the UID from `admin@drnstaylor.co.za` Firebase Auth user)

**Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Admin User` |
| `email` | string | `admin@drnstaylor.co.za` |
| `role` | string | `admin` |
| `practices` | array | `["ruimsig", "weltevreden"]` |
| `createdAt` | timestamp | (current time) |
| `updatedAt` | timestamp | (current time) |

**How to add array field:**
1. Click "Add field"
2. Name: `practices`
3. Type: Select `array`
4. Click "Add item" → Enter: `ruimsig`
5. Click "Add item" → Enter: `weltevreden`

---

#### Document 2: Ruimsig Reception

**Document ID:** (Use the UID from `reception.ruimsig@drnstaylor.co.za` Firebase Auth user)

**Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Ruimsig Reception` |
| `email` | string | `reception.ruimsig@drnstaylor.co.za` |
| `role` | string | `reception` |
| `practices` | array | `["ruimsig"]` |
| `createdAt` | timestamp | (current time) |
| `updatedAt` | timestamp | (current time) |

**Array field:**
- Name: `practices`
- Type: `array`
- Add item: `ruimsig`

---

#### Document 3: Weltevreden Reception

**Document ID:** (Use the UID from `reception.weltevreden@drnstaylor.co.za` Firebase Auth user)

**Fields:**

| Field Name | Type | Value |
|------------|------|-------|
| `name` | string | `Weltevreden Reception` |
| `email` | string | `reception.weltevreden@drnstaylor.co.za` |
| `role` | string | `reception` |
| `practices` | array | `["weltevreden"]` |
| `createdAt` | timestamp | (current time) |
| `updatedAt` | timestamp | (current time) |

**Array field:**
- Name: `practices`
- Type: `array`
- Add item: `weltevreden`

---

## Quick Reference: Login Credentials

After setup, use these to log in:

| Email | Password | Role | Practices |
|-------|----------|------|-----------|
| `admin@drnstaylor.co.za` | `Admin2025!` | Admin | Both |
| `reception.ruimsig@drnstaylor.co.za` | `Reception2025!` | Reception | Ruimsig only |
| `reception.weltevreden@drnstaylor.co.za` | `Reception2025!` | Reception | Weltevreden only |

---

## Step-by-Step Instructions

### For Practices Collection:

1. Go to Firebase Console → Firestore Database
2. Click "Start collection" (or "Add collection" if collections exist)
3. Collection ID: `practices`
4. Document ID: `weltevreden` (or let it auto-generate, then edit)
5. Add each field from the table above
6. For `workingHours` map:
   - Add field → Name: `workingHours` → Type: `map`
   - Click into the map
   - Add `monday` as type `map`
   - Inside `monday`, add `open` (string: `08:00`) and `close` (string: `16:30`)
   - Repeat for tuesday, wednesday, thursday, friday
   - Add `saturday` and `sunday` as type `null`
7. Click "Save"
8. Repeat for `ruimsig` document

### For Staff Users:

1. Go to Firebase Console → Authentication
2. Click "Get started" if first time, or "Add user"
3. For each user:
   - Enter email and password
   - Check "Email verified"
   - Click "Add user"
   - **Copy the UID** (shown in the user list)
4. Go to Firestore Database
5. Create collection: `users`
6. For each staff member:
   - Document ID: Paste their UID
   - Add fields from the table above
   - For `practices` array: Add field → Type: `array` → Add items

---

## Verification

After setup, verify:

1. ✅ `practices` collection has 2 documents: `weltevreden` and `ruimsig`
2. ✅ `users` collection has 3 documents (one for each staff member)
3. ✅ Authentication has 3 users
4. ✅ Each user document has correct `practices` array
5. ✅ Test login at `/staff/login` with one of the accounts

---

## Troubleshooting

**Can't find UID?**
- Go to Authentication → Users
- Click on the user's email
- The UID is shown at the top

**Array field not working?**
- Make sure you select type `array` first
- Then click "Add item" to add values

**Map field confusing?**
- Click "Add field" → Type: `map`
- Click into the map field (it will expand)
- Add nested fields inside

**Timestamp field?**
- Click "Set" button
- Select "Use current time" or pick a date/time

