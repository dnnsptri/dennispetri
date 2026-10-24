import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl } from '../site'

export const metadata: Metadata = {
  title: 'FAQ – Dennis Petri',
  description: 'Frequently asked questions about Dennis Petri, product designer and creative director in The Hague.',
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
}

interface FAQ {
  q: string
  a: string
  position?: number
}

interface FAQData {
  faqs: FAQ[]
  jsonLd: any
}

async function fetchFAQs(): Promise<FAQData | null> {
  try {
    // Fetch from JSON feed and filter by position
    // FAQlue returns all items: EN at position 1-13, NL at position 101-113
    const jsonRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl', {
      next: { revalidate: 3600 },
    })
    
    if (!jsonRes.ok) {
      return null
    }

    const data = await jsonRes.json()
    const allFaqs = data?.faqs?.en || []
    
    // Filter for English items only (position < 100)
    const englishFaqs = allFaqs.filter((faq: FAQ) => 
      !faq.position || faq.position < 100
    )
    
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
                  {faq.a}
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
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
            <a 
              href="mailto:hi@dennispetri.nl" 
              className="text-nav-link"
            >
              hi@dennispetri.nl
            </a>
            <span className="hidden md:inline opacity-30">•</span>
            <a 
              href="tel:+31647258820" 
              className="text-nav-link"
            >
              +31 6 4725 8820
            </a>
            <span className="hidden md:inline opacity-30">•</span>
            <span className="opacity-70">
              Fluwelen Burgwal 58, Den Haag
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
