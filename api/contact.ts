// Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node'

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
  phone: string
  subject: string
  message: string
  branch: string
  ip: string
  timestamp: string
}): Promise<boolean> {
  const emailService = process.env.EMAIL_SERVICE || 'resend'
  const apiKey = process.env.EMAIL_API_KEY
  
  // Route to correct branch email
  let toEmail = process.env.CONTACT_EMAIL || 'contact@example.com'
  if (data.branch === 'Ruimsig') {
    toEmail = process.env.CONTACT_EMAIL_RUIMSIG || process.env.CONTACT_EMAIL || 'contact@example.com'
  } else if (data.branch === 'Weltevreden Park') {
    toEmail = process.env.CONTACT_EMAIL_WELTEVREDEN || process.env.CONTACT_EMAIL || 'contact@example.com'
  }

  if (!apiKey) {
    console.error('Email API key not configured')
    return false
  }

  // Sanitize before sending
  const sanitizedName = sanitizeText(data.name)
  const sanitizedMessage = sanitizeText(data.message)

  const sanitizedSubject = sanitizeText(data.subject)
  const sanitizedPhone = data.phone ? sanitizeText(data.phone) : 'Not provided'

  const emailBody = `New Contact Form Submission

Branch: ${data.branch}
Name: ${sanitizedName}
Email: ${data.email}
Phone: ${sanitizedPhone}
Subject: ${sanitizedSubject}

Message:
${sanitizedMessage}

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
          from: 'Dr NS Taylor Contact Form <onboarding@resend.dev>',
          to: [toEmail],
          subject: `[${data.branch}] ${sanitizedSubject}`,
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
              subject: `[${data.branch}] ${sanitizedSubject}`,
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
function setSecurityHeaders(res: VercelResponse) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://challenges.cloudflare.com; frame-src https://www.google.com/recaptcha/ https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline';")
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set security headers
  setSecurityHeaders(res)

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  try {
    const { name, email, phone, subject, message, branch, recaptchaToken, timeSpent } = req.body

    // Check timing (form must take >5 seconds)
    if (!timeSpent || timeSpent < 5) {
      res.status(400).json({ message: 'Something went wrong. Please try again later.' })
      return
    }

    // Validate input
    const validation = validateInput({ name, email, message })
    if (!validation.valid) {
      res.status(400).json({ message: 'Something went wrong. Please try again later.' })
      return
    }

    // Verify reCAPTCHA
    if (recaptchaToken) {
      const recaptchaValid = await verifyRecaptcha(recaptchaToken)
      if (!recaptchaValid) {
        res.status(400).json({ message: 'Something went wrong. Please try again later.' })
        return
      }
    }

    // Get client IP for rate limiting
    const clientIP =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      'unknown'

    // Rate limiting by IP and email
    const ipAllowed = checkRateLimit(`ip:${clientIP}`)
    const emailAllowed = checkRateLimit(`email:${email.trim().toLowerCase()}`)

    if (!ipAllowed || !emailAllowed) {
      res.status(429).json({ message: 'Something went wrong. Please try again later.' })
      return
    }

    // Send email
    const emailSent = await sendEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'No subject',
      message: message.trim(),
      branch: branch || 'Weltevreden Park',
      ip: clientIP,
      timestamp: new Date().toISOString(),
    })

    if (!emailSent) {
      res.status(500).json({ message: 'Something went wrong. Please try again later.' })
      return
    }

    // Success
    res.status(200).json({ message: 'Thank you!' })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again later.' })
  }
}

