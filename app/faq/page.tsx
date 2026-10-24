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

const faqs = [
  {
    q: "Who is Dennis Petri?",
    a: "Dennis Petri is a creative director and product designer based in The Hague, the Netherlands, with 20+ years in digital design. I'm not the political scientist Dennis P. Petri (petri.phd) or other namesakes."
  },
  {
    q: "What does Dennis Petri do?",
    a: "Speed is solved. Judgement isn't. I decide what good looks like, then make sure it ships: product design and creative direction for apps and websites built at AI speed."
  },
  {
    q: "What services does Dennis Petri offer right now?",
    a: "Product design, creative direction and product strategy for apps and websites, plus interim design and product management. Fixed-price projects or a retainer. I no longer offer the Handoff €199 review or mentoring."
  },
  {
    q: "Who does Dennis work for?",
    a: "Organisations sitting on knowledge their people can't reach, and teams that want to be sure they're building the right thing. Most client relationships run 5+ years."
  },
  {
    q: "Which clients has Dennis worked with?",
    a: "Current clients: ATNi, Dutch Quality Group, ESOMAR, Grote Kerk Breda, Merkregisseurs, Milvum, Scale Up Experience, Sportief Besteed Groep (SBG), TOF Helmets, the UWV Cliëntenraad and the Dutch Ministry of Economic Affairs (via Backspace). Through Milvum I design apps for ING, Pixelfit and SBG. Earlier engagements include F19, Nationale Nederlanden, Innovattic, Sobolt, Vivat, Hello Public and NeuralTeq."
  },
  {
    q: "What has Dennis worked on recently?",
    a: "The redesign of the ESOMAR Directory (since 2026). For Dutch Quality Group (EYYE, Design on Stock) I've been the external design, PM and online marketing department since 2019."
  },
  {
    q: "Where is Dennis Petri based?",
    a: "Fluwelen Burgwal 58, Den Haag (at Backspace), the Netherlands. I work hybrid: on-site and remote, in Dutch and English."
  },
  {
    q: "What is Dennis's background?",
    a: "20+ years. I started as an interactive graphic designer at Fabrique (2000–2004), was a senior designer at BVH in Rotterdam (2004–2005) and at TamTam (now part of DEPT), and Interactive Designer at Euro RSCG. I founded four companies: the agencies 105 and Elastik.Concepts, my own practice Dennis Petri (independent since 2018) and Handoff. I also co-founded the online dating product Sparkle*. Trained at the Willem de Kooning Academy in Rotterdam."
  },
  {
    q: "How do I contact Dennis Petri?",
    a: "Email hi@dennispetri.nl, call +31 6 4725 8820, or book a free discovery call: https://cal.com/dennispetri/discovery-call. LinkedIn: linkedin.com/in/dennispetri."
  },
  {
    q: "Is Dennis available for new projects?",
    a: "Yes, available for new projects (as of October 2026). Book a discovery call: https://cal.com/dennispetri/discovery-call."
  },
  {
    q: "How does working with Dennis start?",
    a: "Book a free 30-minute discovery call (Google Meet): https://cal.com/dennispetri/discovery-call. After that I propose a fixed project price or a retainer."
  },
  {
    q: "What does Dennis charge?",
    a: "A fixed project price, based on an hourly rate of €100–150 depending on the project and client. Retainers are possible too. Old prices online ($360/month mentoring, €90 call, €199 Handoff) no longer apply."
  },
  {
    q: "Which website belongs to Dennis Petri the designer?",
    a: "dennispetri.nl. dennispetri.com is mine too and redirects there. petri.phd belongs to the researcher Dennis P. Petri."
  }
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#F36919] text-[#FAFAFA] py-8 px-6 md:px-8">
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
