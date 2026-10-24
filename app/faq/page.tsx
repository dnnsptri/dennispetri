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
}

async function fetchFAQs(): Promise<{ faqs: FAQ[]; html?: string } | null> {
  try {
    // Try the HTML endpoint first (preferred, not live yet)
    try {
      const htmlRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl/html?locale=en', {
        next: { revalidate: 3600 },
      })
      if (htmlRes.ok) {
        const html = await htmlRes.text()
        return { faqs: [], html }
      }
    } catch {}

    // Fall back to JSON feed
    const jsonRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl', {
      next: { revalidate: 3600 },
    })
    
    if (!jsonRes.ok) {
      return null
    }

    const data = await jsonRes.json()
    const faqs = data?.faqs?.en || []
    return { faqs }
  } catch (error) {
    console.error('Failed to fetch FAQs from FAQlue:', error)
    return null
  }
}

async function fetchFAQJsonLd(): Promise<any> {
  try {
    // Try the JSON-LD endpoint first (preferred, not live yet)
    try {
      const jsonLdRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl/jsonld?locale=en', {
        next: { revalidate: 3600 },
      })
      if (jsonLdRes.ok) {
        return await jsonLdRes.json()
      }
    } catch {}

    // Fall back to constructing from JSON feed
    const jsonRes = await fetch('https://faqlue.com/api/faq/dennispetri-nl', {
      next: { revalidate: 3600 },
    })
    
    if (!jsonRes.ok) {
      return null
    }

    const data = await jsonRes.json()
    const faqs = data?.faqs?.en || []
    
    // Construct FAQPage JSON-LD from the FAQ data
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'en',
      mainEntity: faqs.map((faq: FAQ) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    }
  } catch (error) {
    console.error('Failed to fetch FAQ JSON-LD from FAQlue:', error)
    return null
  }
}

export default async function FAQ() {
  const faqData = await fetchFAQs()
  const faqJsonLd = await fetchFAQJsonLd()

  // If FAQlue returned HTML, use it directly
  if (faqData?.html) {
    return (
      <div className="min-h-screen bg-[#F36919] text-[#FAFAFA] py-8 px-6 md:px-8">
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

          {/* FAQ HTML from FAQlue */}
          <div 
            className="space-y-8"
            dangerouslySetInnerHTML={{ __html: faqData.html }}
          />

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

  // Render from JSON feed, or show nothing if FAQlue is down
  const faqs = faqData?.faqs || []

  return (
    <div className="min-h-screen bg-[#F36919] text-[#FAFAFA] py-8 px-6 md:px-8">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
