/**
 * Unit tests for the linkify utility
 * 
 * Run with: npx tsx app/utils/linkify.test.ts
 * Or add to package.json scripts: "test": "tsx app/utils/linkify.test.ts"
 */

import { linkify } from './linkify'
import React from 'react'

// Simple test runner
let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`✓ ${name}`)
    passed++
  } catch (error) {
    console.error(`✗ ${name}`)
    console.error(`  ${error}`)
    failed++
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertIncludes(array: any[], item: any, message: string) {
  if (!array.some(el => JSON.stringify(el) === JSON.stringify(item))) {
    throw new Error(message)
  }
}

// Helper to extract link props from React elements
function extractLink(elements: React.ReactNode[], index: number) {
  const element = elements[index]
  if (React.isValidElement(element) && element.type === 'a') {
    return element.props
  }
  return null
}

// Tests
console.log('\nRunning linkify tests...\n')

test('returns plain text unchanged when no links present', () => {
  const result = linkify('This is plain text with no links.')
  assert(result.length === 1, 'Should return single element')
  assert(result[0] === 'This is plain text with no links.', 'Should return unchanged text')
})

test('linkifies email addresses with mailto:', () => {
  const result = linkify('Contact hi@dennispetri.nl for more info.')
  assert(result.length === 3, 'Should return 3 elements')
  assert(result[0] === 'Contact ', 'Should have text before')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'mailto:hi@dennispetri.nl', 'Should have mailto: href')
  assert(link.children === 'hi@dennispetri.nl', 'Should show email as text')
  assert(link.className === 'text-nav-link', 'Should have link class')
  
  assert(result[2] === ' for more info.', 'Should have text after')
})

test('linkifies phone numbers with tel:', () => {
  const result = linkify('Call +31 6 4725 8820 for assistance.')
  assert(result.length === 3, 'Should return 3 elements')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'tel:+31647258820', 'Should have tel: href without spaces')
  assert(link.children === '+31 6 4725 8820', 'Should show phone as written')
})

test('linkifies URLs with https:// protocol', () => {
  const result = linkify('Visit https://dennispetri.nl for details.')
  assert(result.length === 3, 'Should return 3 elements')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://dennispetri.nl', 'Should have https:// href')
  assert(link.children === 'https://dennispetri.nl', 'Should show URL with protocol')
  assert(link.target === '_blank', 'Should open in new tab')
  assert(link.rel === 'noopener noreferrer', 'Should have rel attribute')
})

test('linkifies URLs without protocol and adds https://', () => {
  const result = linkify('Visit dennispetri.nl for details.')
  assert(result.length === 3, 'Should return 3 elements')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://dennispetri.nl', 'Should add https:// to href')
  assert(link.children === 'dennispetri.nl', 'Should show URL without protocol')
})

test('removes trailing punctuation from URLs', () => {
  const result = linkify('Visit cal.com/dennispetri/call. More text here.')
  assert(result.length === 3, 'Should return 3 elements')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://cal.com/dennispetri/call', 'Should not include trailing period')
  assert(link.children === 'cal.com/dennispetri/call', 'Should not include trailing period in text')
  assert(result[2] === '. More text here.', 'Should keep trailing period in text after link')
})

test('handles multiple links in one text', () => {
  const text = 'Email hi@dennispetri.nl, call +31 6 4725 8820, or visit dennispetri.nl.'
  const result = linkify(text)
  
  assert(result.length === 7, 'Should return 7 elements (3 texts + 3 links + 1 text)')
  
  // Email link
  const emailLink = extractLink(result, 1)
  assert(emailLink !== null, 'Should have email link')
  assert(emailLink.href === 'mailto:hi@dennispetri.nl', 'Should linkify email')
  
  // Phone link
  const phoneLink = extractLink(result, 3)
  assert(phoneLink !== null, 'Should have phone link')
  assert(phoneLink.href === 'tel:+31647258820', 'Should linkify phone')
  
  // URL link
  const urlLink = extractLink(result, 5)
  assert(urlLink !== null, 'Should have URL link')
  assert(urlLink.href === 'https://dennispetri.nl', 'Should linkify URL')
})

test('handles LinkedIn URLs correctly', () => {
  const result = linkify('LinkedIn: linkedin.com/in/dennispetri.')
  assert(result.length === 3, 'Should return 3 elements')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://linkedin.com/in/dennispetri', 'Should linkify LinkedIn URL')
  assert(link.children === 'linkedin.com/in/dennispetri', 'Should not include trailing period')
})

test('handles Cal.com URLs correctly', () => {
  const result = linkify('Book: https://cal.com/dennispetri/discovery-call')
  assert(result.length === 2, 'Should return 2 elements (text + link)')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://cal.com/dennispetri/discovery-call', 'Should linkify Cal.com URL')
})

test('returns empty array for empty string', () => {
  const result = linkify('')
  assert(result.length === 1, 'Should return single element')
  assert(result[0] === '', 'Should return empty string')
})

test('does not linkify short phone-like numbers', () => {
  const result = linkify('The number 123 is too short.')
  assert(result.length === 1, 'Should not linkify short numbers')
  assert(result[0] === 'The number 123 is too short.', 'Should return unchanged')
})

test('handles overlapping matches correctly', () => {
  // If there's overlap, should prefer the earlier match
  const result = linkify('Email: test@example.com@domain.com')
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'mailto:test@example.com', 'Should linkify first email match')
})

test('does NOT linkify company names with dots (Elastik.Concepts)', () => {
  const result = linkify('Founded Elastik.Concepts in 2010.')
  assert(result.length === 1, 'Should return single element (no links)')
  assert(result[0] === 'Founded Elastik.Concepts in 2010.', 'Should not linkify Elastik.Concepts')
})

test('does NOT linkify partial domain matches (random.co)', () => {
  const result = linkify('The random.co word should not link.')
  assert(result.length === 1, 'Should return single element (no links)')
  assert(result[0] === 'The random.co word should not link.', 'Should not linkify random TLD matches')
})

test('does NOT linkify names that look like domains', () => {
  const result = linkify('Visit Dr. Smith or Prof.io for advice.')
  assert(result.length === 1, 'Should return single element (no links)')
  assert(result[0] === 'Visit Dr. Smith or Prof.io for advice.', 'Should not linkify Prof.io')
})

test('ONLY linkifies allowlisted domains without protocol', () => {
  // Should linkify linkedin.com (in allowlist)
  const linkedInResult = linkify('Visit linkedin.com/in/dennispetri')
  const link1 = extractLink(linkedInResult, 1)
  assert(link1 !== null, 'Should linkify linkedin.com (allowlisted)')
  assert(link1.href === 'https://linkedin.com/in/dennispetri', 'Should have correct href')
  
  // Should NOT linkify github.com (not in allowlist)
  const githubResult = linkify('Visit github.com for code')
  assert(githubResult.length === 1, 'Should not linkify github.com (not allowlisted)')
  assert(githubResult[0] === 'Visit github.com for code', 'Should return unchanged')
})

test('ALWAYS linkifies URLs with https:// protocol regardless of allowlist', () => {
  const result = linkify('Visit https://github.com for code.')
  assert(result.length === 3, 'Should linkify URLs with protocol')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://github.com', 'Should linkify any URL with https://')
})

test('linkifies allowlisted cal.com correctly', () => {
  const result = linkify('Book at cal.com/dennispetri/discovery-call')
  assert(result.length === 2, 'Should return 2 elements (text + link)')
  
  const link = extractLink(result, 1)
  assert(link !== null, 'Should have link element')
  assert(link.href === 'https://cal.com/dennispetri/discovery-call', 'Should linkify cal.com')
})

// Summary
console.log(`\n${passed} passed, ${failed} failed\n`)

if (failed > 0) {
  process.exit(1)
}
