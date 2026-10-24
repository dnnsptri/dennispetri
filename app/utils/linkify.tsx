import React from 'react'

interface LinkMatch {
  type: 'email' | 'phone' | 'url'
  text: string
  href: string
  start: number
  end: number
}

// Regex patterns for detecting links in text
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
const PHONE_PATTERN = /\+\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{0,9}/g
const URL_WITH_PROTOCOL_PATTERN = /https?:\/\/[^\s<]+/gi

// Allowlist of known domains to linkify (without protocol)
// Only these will be converted to links when not prefixed with https://
const ALLOWED_DOMAINS = [
  'linkedin.com',
  'cal.com',
  'dennispetri.nl',
  'dennispetri.com',
]

// Build regex pattern from allowlist that matches full domains at word boundaries
// Pattern ensures the domain ends at a word boundary or is followed by / or whitespace
function buildAllowlistPattern(): RegExp {
  const escapedDomains = ALLOWED_DOMAINS.map(domain => 
    domain.replace(/\./g, '\\.')
  )
  const pattern = `\\b(${escapedDomains.join('|')})(?:\\/[^\\s<]*)?\\b`
  return new RegExp(pattern, 'gi')
}

const URL_WITHOUT_PROTOCOL_PATTERN = buildAllowlistPattern()

/**
 * Extract all link matches from text
 */
function extractMatches(text: string): LinkMatch[] {
  const matches: LinkMatch[] = []

  // Find emails
  let match
  const emailRegex = new RegExp(EMAIL_PATTERN)
  while ((match = emailRegex.exec(text)) !== null) {
    matches.push({
      type: 'email',
      text: match[0],
      href: `mailto:${match[0]}`,
      start: match.index,
      end: match.index + match[0].length,
    })
  }

  // Find phone numbers (must start with +)
  const phoneRegex = new RegExp(PHONE_PATTERN)
  while ((match = phoneRegex.exec(text)) !== null) {
    let phoneText = match[0]
    // Remove trailing whitespace
    const trimmedPhone = phoneText.trimEnd()
    const trimAmount = phoneText.length - trimmedPhone.length
    phoneText = trimmedPhone
    
    // Only consider it a phone if it has enough digits
    const digitsOnly = phoneText.replace(/\D/g, '')
    if (digitsOnly.length >= 10) {
      matches.push({
        type: 'phone',
        text: phoneText,
        href: `tel:${phoneText.replace(/[\s-]/g, '')}`,
        start: match.index,
        end: match.index + phoneText.length,
      })
    }
  }

  // Find URLs with protocol first
  const urlWithProtocolRegex = new RegExp(URL_WITH_PROTOCOL_PATTERN)
  while ((match = urlWithProtocolRegex.exec(text)) !== null) {
    const urlText = match[0]
    const cleanUrl = urlText.replace(/[.,;:!?)\]]+$/, '')
    
    matches.push({
      type: 'url',
      text: cleanUrl,
      href: cleanUrl,
      start: match.index,
      end: match.index + cleanUrl.length,
    })
  }

  // Find URLs without protocol
  const urlWithoutProtocolRegex = new RegExp(URL_WITHOUT_PROTOCOL_PATTERN)
  while ((match = urlWithoutProtocolRegex.exec(text)) !== null) {
    const urlText = match[0]
    const cleanUrl = urlText.replace(/[.,;:!?)\]]+$/, '')
    
    matches.push({
      type: 'url',
      text: cleanUrl,
      href: `https://${cleanUrl}`,
      start: match.index,
      end: match.index + cleanUrl.length,
    })
  }

  // Sort by start position and remove overlaps (prefer earlier matches)
  matches.sort((a, b) => a.start - b.start)
  
  const nonOverlapping: LinkMatch[] = []
  for (const current of matches) {
    const hasOverlap = nonOverlapping.some(
      existing => 
        (current.start >= existing.start && current.start < existing.end) ||
        (current.end > existing.start && current.end <= existing.end)
    )
    if (!hasOverlap) {
      nonOverlapping.push(current)
    }
  }

  return nonOverlapping
}

/**
 * Linkify text by converting emails, phone numbers, and URLs to clickable links.
 * Returns an array of React elements (text and links).
 * 
 * @param text - Plain text that may contain linkable content
 * @returns Array of React nodes with text and link elements
 */
export function linkify(text: string): React.ReactNode[] {
  if (!text) return [text]

  const matches = extractMatches(text)
  
  if (matches.length === 0) {
    return [text]
  }

  const elements: React.ReactNode[] = []
  let lastIndex = 0

  matches.forEach((match, index) => {
    // Add text before the link
    if (match.start > lastIndex) {
      elements.push(text.substring(lastIndex, match.start))
    }

    // Add the link
    const isExternal = match.type === 'url'
    elements.push(
      <a
        key={`link-${index}`}
        href={match.href}
        className="text-nav-link"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {match.text}
      </a>
    )

    lastIndex = match.end
  })

  // Add remaining text after last link
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex))
  }

  return elements
}
