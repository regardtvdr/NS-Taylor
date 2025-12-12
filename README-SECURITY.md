# Security Features Implementation

This contact form implements comprehensive security features as specified.

## Implemented Security Features

### 1. Server-side Input Validation and Sanitization ✅
- All inputs are trimmed
- Name: max 100 chars, allows letters, spaces, hyphens, apostrophes only
- Email: strict email regex + max 254 chars
- Message: max 2000 chars, HTML/JS stripped/escaped
- Returns 400 with generic message if invalid

### 2. Rate Limiting / Anti-spam ✅
- Maximum 5 submissions per IP every 10 minutes
- Maximum 5 submissions per email address every 10 minutes
- Uses in-memory store (for production, consider Redis/Upstash)

### 3. Bot Protection ✅
- **Honeypot field**: Hidden input that bots fill (silently rejected)
- **Timed submission**: Form must take >5 seconds to submit
- **reCAPTCHA v3**: Invisible reCAPTCHA integration

### 4. Security Headers ✅
All required headers are set:
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=()

### 5. Force HTTPS ✅
- HTTP → HTTPS redirect configured
- Strict-Transport-Security header (HSTS) with max-age=31536000; includeSubDomains

### 6. Email Sanitization ✅
- HTML/JS escaped before sending email
- Email subject and body are plain text only
- Sender's IP and timestamp included in email

### 7. Error Messages ✅
- Never leaks details
- Always returns generic messages: "Thank you" or "Something went wrong, try again later"

### 8. CORS ✅
- Access-Control-Allow-Origin: configured domain
- Access-Control-Allow-Credentials: true

### 9. Environment Variables ✅
- All secrets use environment variables
- Never hardcoded in source

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your values:
- `VITE_RECAPTCHA_SITE_KEY`: Get from https://www.google.com/recaptcha/admin
- `RECAPTCHA_SECRET_KEY`: Get from https://www.google.com/recaptcha/admin
- `EMAIL_SERVICE`: 'resend' or 'sendgrid'
- `EMAIL_API_KEY`: Your email service API key
- `CONTACT_EMAIL`: Where to send contact form submissions
- `ALLOWED_ORIGIN`: Your production domain

### 3. Deploy

#### For Vercel:
- Functions are in `api/contact.ts`
- Deploy with `vercel deploy`
- Set environment variables in Vercel dashboard

#### For Netlify:
- Functions are in `netlify/functions/contact.ts`
- Deploy with `netlify deploy --prod`
- Set environment variables in Netlify dashboard

### 4. Update Domain
- Update `ALLOWED_ORIGIN` in environment variables
- Update redirect URLs in `vercel.json` and `netlify.toml` to your actual domain

## Testing

1. Test honeypot: Fill the hidden field → should be rejected silently
2. Test timing: Submit in <5 seconds → should show error
3. Test rate limiting: Submit 6 times quickly → 6th should be rate limited
4. Test validation: Submit invalid data → should show generic error
5. Test success: Submit valid form → should show success message

## Production Recommendations

1. **Rate Limiting**: Replace in-memory store with Redis/Upstash for production
2. **Email Service**: Use a reliable service like Resend or SendGrid
3. **Monitoring**: Add logging/monitoring for failed submissions
4. **Domain**: Update all references to your actual domain

