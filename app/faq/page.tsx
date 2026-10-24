import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl } from '../site'
import Footer from '../components/Footer'
import { linkify } from '../utils/linkify'

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

async function fetchFAQs(): Promise<FAQData | null> {
  try {
    // Fetch from FAQlue API
    // API returns: {context: string, items: [{question, answer, position, ...}]}
    // English items at positions 1-13, Dutch at positions 101-113
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
    // Map API response to our FAQ format
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

// Dynamic route to prevent caching failures at build time
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function FAQ() {
  const faqData = await fetchFAQs()
  
  // Extract FAQs and JSON-LD (both filtered for English only)
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
            className="inline-block text-nav-link mb-6 hover:underline"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-medium mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-body opacity-90">
            Everything you need to know about working with Dennis Petri.
          </p>
        </header>

        {/* FAQ List */}
        {faqs.length > 0 ? (
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <article key={index} className="border-b border-white/10 pb-8 last:border-0">
                <h2 className="text-xl md:text-2xl font-medium mb-3">
                  {faq.q}
                </h2>
                <p className="text-body opacity-90 whitespace-pre-wrap">
                  {linkify(faq.a)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-body opacity-70">
            <p>FAQ content is temporarily unavailable. Please check back later.</p>
          </div>
        )}

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
          <Footer />
        </div>
      </div>
    </div>
  )
}
