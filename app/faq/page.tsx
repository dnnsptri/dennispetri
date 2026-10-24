import type { Metadata } from 'next'
import { siteUrl } from '../site'
import Footer from '../components/Footer'
import FAQClient from './FAQClient'
import { SHOW_FAQLUE_ATTRIBUTION } from './config'

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
      
      <FAQClient faqs={faqs} showFaqlueAttribution={SHOW_FAQLUE_ATTRIBUTION} />

      {/* Footer */}
      <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-white/10">
        <Footer />
      </div>
    </div>
  )
}
