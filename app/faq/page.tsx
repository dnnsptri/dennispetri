import type { Metadata } from 'next'
import Link from 'next/link'
import { siteUrl } from '../site'
import Footer from '../components/Footer'
import Script from 'next/script'

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

async function generateJSONLD(): Promise<any | null> {
  try {
    // Fetch from FAQlue API for JSON-LD only
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
    return {
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
  } catch (error) {
    console.error('Failed to fetch FAQs from FAQlue:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function FAQ() {
  const jsonLd = await generateJSONLD()

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
          <p className="text-body opacity-90">
            Everything you need to know about working with Dennis Petri.
          </p>
        </header>

        {/* FAQlue Widget */}
        <div id="faqlue-widget-container">
          <Script
            src="https://faqlue.com/embed.js"
            data-context="dennispetri-nl"
            data-locale="en"
            strategy="afterInteractive"
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Footer />
        </div>
      </div>
    </div>
  )
}
