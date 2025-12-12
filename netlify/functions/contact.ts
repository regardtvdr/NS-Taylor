// Netlify Serverless Function
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

// In-memory rate limiting store (for production, use Redis/Upstash)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes
const MAX_SUBMISSIONS = 5

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Sanitize HTML/JS from text
function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate and sanitize input
function validateInput(data: {
  name?: string
  email?: string
  message?: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Trim all inputs
  const name = (data.name || '').trim()
  const email = (data.email || '').trim()
  const message = (data.message || '').trim()

  // Check if empty
  if (!name) errors.push('Name is required')
  if (!email) errors.push('Email is required')
  if (!message) errors.push('Message is required')

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Name validation: max 100 chars, letters, spaces, hyphens, apostrophes only
  if (name.length > 100) {
    errors.push('Name exceeds maximum length')
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.push('Name contains invalid characters')
  }

  // Email validation: strict regex + max 254 chars
  if (email.length > 254) {
    errors.push('Email exceeds maximum length')
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format')
  }

  // Message validation: max 2000 chars
  if (message.length > 2000) {
    errors.push('Message exceeds maximum length')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Check rate limit
function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (entry.count >= MAX_SUBMISSIONS) {
    return false
  }

  entry.count++
  return true
}

// Verify reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    // If no secret key configured, skip verification (for development)
    return true
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true && data.score >= 0.5 // reCAPTCHA v3 score threshold
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

// Send email (using a service like SendGrid, Resend, or similar)
async function sendEmail(data: {
  name: string
  email: string
  message: string
  ip: string
  timestamp: string
}): Promise<boolean> {
  const emailService = process.env.EMAIL_SERVICE || 'resend'
  const apiKey = process.env.EMAIL_API_KEY
  const toEmail = process.env.CONTACT_EMAIL || 'contact@example.com'

  if (!apiKey) {
    console.error('Email API key not configured')
    return false
  }

  // Sanitize before sending
  const sanitizedName = sanitizeText(data.name)
  const sanitizedMessage = sanitizeText(data.message)

  const emailBody = `New Contact Form Submission

Name: ${sanitizedName}
Email: ${data.email}
Message: ${sanitizedMessage}

---
IP Address: ${data.ip}
Timestamp: ${data.timestamp}
`

  try {
    if (emailService === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Contact Form <noreply@yourdomain.com>',
          to: [toEmail],
          subject: `Contact Form: ${sanitizedName}`,
          text: emailBody,
        }),
      })

      return response.ok
    } else if (emailService === 'sendgrid') {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: toEmail }],
              subject: `Contact Form: ${sanitizedName}`,
            },
          ],
          from: { email: 'noreply@yourdomain.com', name: 'Contact Form' },
          content: [
            {
              type: 'text/plain',
              value: emailBody,
            },
          ],
        }),
      })

      return response.ok
    }

    // Default: log to console (for development)
    console.log('Email would be sent:', emailBody)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

// Security headers
function getSecurityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://challenges.cloudflare.com; frame-src https://www.google.com/recaptcha/ https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: getSecurityHeaders(),
      body: JSON.stringify({ message: 'Method not allowed' }),
    }
  }

  // CORS headers (adjust origin to your domain)
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://yourdomain.com'
  const origin = event.headers.origin || event.headers.referer

  const headers = {
    ...getSecurityHeaders(),
    'Content-Type': 'application/json',
  }

  if (origin && origin.startsWith(allowedOrigin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
    headers['Access-Control-Allow-Methods'] = 'POST'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { name, email, message, recaptchaToken, timeSpent } = body

    // Check timing (form must take >5 seconds)
    if (!timeSpent || timeSpent < 5) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
      }
    }

    // Validate input
    const validation = validateInput({ name, email, message })
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
      }
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaValid) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
        }
      }
    }

    // Get client IP for rate limiting
    const clientIP =
      event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      event.headers['x-real-ip'] ||
      event.clientContext?.ip ||
      'unknown'

    // Rate limiting by IP and email
    const ipAllowed = checkRateLimit(`ip:${clientIP}`)
    const emailAllowed = checkRateLimit(`email:${email.trim().toLowerCase()}`)

    if (!ipAllowed || !emailAllowed) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
      }
    }

    // Send email
    const emailSent = await sendEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ip: clientIP,
      timestamp: new Date().toISOString(),
    })

    if (!emailSent) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
      }
    }

    // Success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Thank you!' }),
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Something went wrong. Please try again later.' }),
    }
  }
}

