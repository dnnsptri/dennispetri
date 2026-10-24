import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl } from '../site'
import Footer from '../components/Footer'
import FAQWidget from './FAQWidget'

export const metadata: Metadata = {
  title: 'FAQ – Dennis Petri',
  description: 'Frequently asked questions about Dennis Petri, product designer and creative director in The Hague.',
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
}

interface FAQItem {
  question: string
  answer: string
  position: number
}

interface FAQ {
  q: string
  a: string
}

interface FAQData {
  faqs: FAQ[]
  jsonLd: any
}

async function fetchFAQData(): Promise<FAQData | null> {
  try {
    // Fetch from FAQlue API for JSON-LD and fallback
    const jsonRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl', {
      next: { revalidate: 3600 },
    })
    
    if (!jsonRes.ok) {
      console.error('FAQlue API returned non-ok status:', jsonRes.status)
      return null
    }

    const data = await jsonRes.json()
    const allItems = data?.items || []
    
    if (!Array.isArray(allItems) || allItems.length === 0) {
      console.error('No items found in FAQlue response')
      return null
    }
    
    // Filter for English items only (position < 100)
    const englishFaqs: FAQ[] = allItems
      .filter((item: FAQItem) => item.position < 100)
      .map((item: FAQItem) => ({
        q: item.question,
        a: item.answer,
      }))
    
    if (englishFaqs.length === 0) {
      console.error('No English FAQs found after filtering')
      return null
    }
    
    // Build FAQPage JSON-LD from filtered English FAQs
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'en',
      mainEntity: englishFaqs.map((faq: FAQ) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }
    
    return { faqs: englishFaqs, jsonLd }
  } catch (error) {
    console.error('Failed to fetch FAQs from FAQlue:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildFallbackHTML(faqs: FAQ[]): string {
  const chevronSvg = '<svg class="w-5 h-5 flex-shrink-0 text-white/50 transition-transform group-open:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
  
  const items = faqs.map((faq, index) => `
    <details class="group border-b border-white/20 py-4" ${index === 0 ? 'open' : ''}>
      <summary class="cursor-pointer text-lg font-medium flex items-center justify-between list-none [&::-webkit-details-marker]:hidden"><span class="pr-4">${escapeHtml(faq.q)}</span>${chevronSvg}</summary>
      <div class="mt-3 text-body opacity-90 whitespace-pre-wrap">${escapeHtml(faq.a)}</div>
    </details>
  `).join('')
  
  return `<div data-faqlue-fallback="dennispetri-nl">${items}</div><script src="https://faqlue.com/embed.js" data-context="dennispetri-nl" data-locale="en" async></script>`
}

export default async function FAQ() {
  const faqData = await fetchFAQData()
  const faqs = faqData?.faqs || []
  const jsonLd = faqData?.jsonLd

  return (
    <div className="min-h-screen bg-[#F36919] text-[#FAFAFA] py-8 px-6 md:px-8">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <Link 
            href="/" 
            className="inline-block text-nav-link mb-[140px] hover:underline"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-medium mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-body opacity-90 mb-6">
            Everything you need to know about working with Dennis Petri.
          </p>
          <p className="text-body opacity-70 text-sm">
            This FAQ is mainly here so AI assistants and search engines can find accurate answers about Dennis&rsquo;s work.
          </p>
        </header>

        {/* FAQlue Widget */}
        <FAQWidget fallbackHTML={buildFallbackHTML(faqs)} />

        {/* Powered by FAQlue */}
        <div className="mt-8 text-center">
          <a 
            href="https://faqlue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            Powered by FAQlue
          </a>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-body mb-4">
            Have more questions?
          </p>
          <a 
            href="https://cal.com/dennispetri/discovery-call"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a discovery call
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Footer hideFaqLink />
        </div>
      </div>
    </div>
  )
}
