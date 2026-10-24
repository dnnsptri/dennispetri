'use client'

import { useState, useEffect, useRef } from 'react'
import { linkify } from '../utils/linkify'

interface FAQ {
  q: string
  a: string
  category?: string
}

interface FAQClientProps {
  faqs: FAQ[]
  showFaqlueAttribution: boolean
}

export default function FAQClient({ faqs, showFaqlueAttribution }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const [question, setQuestion] = useState('')
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const formTimestamp = useRef(Date.now())

  // Reset form timestamp when component mounts
  useEffect(() => {
    formTimestamp.current = Date.now()
  }, [])

  // Extract unique categories from FAQs
  const uniqueCategories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))
  const categories = ['all', ...uniqueCategories] as string[]

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setFormError('')

    try {
      const response = await fetch('/api/faq-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          email: email || undefined,
          honeypot,
          timestamp: formTimestamp.current,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormError(data.error || 'Failed to send question. Please try again.')
        setFormState('error')
        return
      }

      setFormState('success')
      setQuestion('')
      setEmail('')
      
      // Reset form timestamp after successful submission
      setTimeout(() => {
        formTimestamp.current = Date.now()
        setFormState('idle')
      }, 5000)
    } catch (error) {
      setFormError('An unexpected error occurred. Please try again.')
      setFormState('error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <a 
          href="/" 
          className="inline-block text-nav-link mb-[140px] hover:underline"
        >
          ← Back to home
        </a>
        <h1 className="text-4xl md:text-5xl font-medium mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-body opacity-90">
          Everything you need to know about working with Dennis Petri.
        </p>
      </header>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Field */}
        <div>
          <label htmlFor="faq-search" className="sr-only">
            Search questions and answers
          </label>
          <input
            id="faq-search"
            type="text"
            placeholder="Search questions and answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>

        {/* Category Filter (only show if categories exist) */}
        {categories.length > 1 && (
          <div>
            <label htmlFor="faq-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="faq-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '3rem',
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FAQ List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-4 mb-12">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedItems.has(index)
            return (
              <article 
                key={index} 
                className="border border-white/20 rounded-lg overflow-hidden bg-white/5"
              >
                <h2>
                  <button
                    onClick={() => toggleItem(index)}
                    aria-expanded={isExpanded}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xl md:text-2xl font-medium pr-4">
                      {faq.q}
                    </span>
                    <span 
                      className="flex-shrink-0 text-2xl transform transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </button>
                </h2>
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="text-body opacity-90 whitespace-pre-wrap pt-2">
                      {linkify(faq.a)}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="text-body opacity-70 mb-12 p-8 bg-white/5 rounded-lg border border-white/20 text-center">
          <p>No FAQs match your search. Try a different query or browse all questions.</p>
        </div>
      )}

      {/* Can't Find Your Answer Form */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-medium mb-4">
          Can't find your answer?
        </h2>
        <p className="text-body opacity-90 mb-6">
          Submit your question and Dennis will get back to you.
        </p>

        {formState === 'success' ? (
          <div className="p-6 bg-white/10 rounded-lg border border-white/20">
            <p className="text-body">
              ✓ Thank you! Your question has been sent to Dennis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field (hidden from users) */}
            <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="question" className="block text-body mb-2">
                Your question <span className="text-white/50">(required)</span>
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent resize-y"
                placeholder="What would you like to know?"
                disabled={formState === 'submitting'}
              />
              <p className="text-sm text-white/50 mt-1">
                {question.length}/1000 characters
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-body mb-2">
                Your email <span className="text-white/50">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                placeholder="your@email.com"
                disabled={formState === 'submitting'}
              />
              <p className="text-sm text-white/50 mt-1">
                Provide your email if you'd like a personal reply.
              </p>
            </div>

            {formError && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-body text-red-100">{formError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting' || !question.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState === 'submitting' ? 'Sending...' : 'Send Question'}
            </button>
          </form>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <p className="text-body mb-4">
          Ready to get started?
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

      {/* Powered by FAQlue */}
      {showFaqlueAttribution && (
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <a
            href="https://faqlue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            Powered by FAQlue
          </a>
        </div>
      )}
    </div>
  )
}
