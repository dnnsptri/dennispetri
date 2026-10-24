import { NextRequest, NextResponse } from 'next/server'

/**
 * Spam protection configuration
 */
const MIN_SUBMIT_TIME_MS = 3000 // Minimum 3 seconds to submit
const MAX_QUESTION_LENGTH = 1000
const MAX_EMAIL_LENGTH = 254 // RFC 5321 max email length
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3

/**
 * In-memory rate limiting store
 * In production, consider using Redis or a database
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback to a placeholder (this shouldn't happen on Vercel)
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  if (!record || now > record.resetAt) {
    // Create new record or reset expired one
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }
  
  // Increment count
  record.count++
  return true
}

// Clean up old entries periodically (basic memory management)
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(rateLimitStore.entries())
  for (const [ip, record] of entries) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip)
    }
  }
}, RATE_LIMIT_WINDOW_MS)

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { question, email, honeypot, timestamp } = body
    
    // Honeypot check (should be empty)
    if (honeypot) {
      console.log('Honeypot triggered')
      return NextResponse.json({ success: true }) // Pretend success to fool bots
    }
    
    // Minimum time check
    const submitTime = Date.now()
    const timeTaken = submitTime - (timestamp || 0)
    if (timeTaken < MIN_SUBMIT_TIME_MS) {
      console.log('Submit too fast:', timeTaken)
      return NextResponse.json(
        { error: 'Please take a moment to review your question.' },
        { status: 400 }
      )
    }
    
    // Validation
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      )
    }
    
    if (question.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json(
        { error: `Question must be under ${MAX_QUESTION_LENGTH} characters.` },
        { status: 400 }
      )
    }
    
    if (email && typeof email === 'string') {
      if (email.length > MAX_EMAIL_LENGTH) {
        return NextResponse.json(
          { error: 'Email address is too long.' },
          { status: 400 }
        )
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address.' },
          { status: 400 }
        )
      }
    }
    
    // Send email (requires RESEND_API_KEY environment variable)
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact Dennis directly.' },
        { status: 500 }
      )
    }
    
    // Send via Resend API
    const emailPayload = {
      from: 'FAQ Questions <noreply@dennispetri.nl>',
      to: 'hi@dennispetri.nl',
      subject: 'New FAQ Question from dennispetri.nl',
      text: `New FAQ question received:\n\n${question}${email ? `\n\nReply to: ${email}` : '\n\n(No email provided)'}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #F36919;">New FAQ Question</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="white-space: pre-wrap; color: #333;">${question}</p>
          </div>
          ${email ? `<p style="color: #666;"><strong>Reply to:</strong> ${email}</p>` : '<p style="color: #999;"><em>No email provided</em></p>'}
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Submitted from dennispetri.nl/faq</p>
        </div>
      `,
    }
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error('Resend API error:', resendResponse.status, errorText)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again or contact Dennis directly.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error handling FAQ question:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
