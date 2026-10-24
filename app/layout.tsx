import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Analytics from './components/Analytics'
import { iconVersion, siteDescription, siteTitle, siteUrl } from './site'

// Sailec is licensed, so it lives in app/ rather than public/: next/font emits
// it to /_next/static/media/ under a content hash instead of serving it from a
// guessable path. Self-hosting also drops the render-blocking round trip to
// Google that the old @import cost.
// Sailec ships no SemiBold. Only the four weights below exist, so a
// font-weight:600 request resolves up to Bold (700) rather than being
// synthesised.
const sailec = localFont({
  src: [
    { path: './fonts/SailecLight/font.woff2', weight: '300', style: 'normal' },
    { path: './fonts/SailecRegular/font.woff2', weight: '400', style: 'normal' },
    { path: './fonts/SailecMedium/font.woff2', weight: '500', style: 'normal' },
    { path: './fonts/SailecBold/font.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sailec',
  display: 'swap',
})

export const metadata: Metadata = {
  // metadataBase covers most URL resolution, but dev overrides it with the
  // local origin, so OG image URLs are written absolute below to guarantee
  // scrapers always get the production host.
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Dennis Petri',
    title: siteTitle,
    description: siteDescription,
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/DP_OpenGraph.png`,
        width: 1200,
        height: 630,
        alt: 'Dennis Petri, product design & creative direction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/DP_OpenGraph.png`],
  },
  // ?v=2 busts the browser favicon cache. Chrome and Safari hold onto icons
  // far past a hard refresh, so the old mark survives a deploy without it.
  // Bump this whenever the icon artwork changes.
  icons: {
    icon: [
      { url: `/favicon.ico?v=${iconVersion}`, sizes: 'any' },
      { url: `/favicon-32x32.png?v=${iconVersion}`, sizes: '32x32', type: 'image/png' },
      { url: `/favicon-16x16.png?v=${iconVersion}`, sizes: '16x16', type: 'image/png' },
    ],
    shortcut: `/favicon.ico?v=${iconVersion}`,
    apple: [
      { url: `/apple-icon-180x180.png?v=${iconVersion}`, sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'msapplication-TileColor': '#F36919',
    'msapplication-TileImage': `/ms-icon-144x144.png?v=${iconVersion}`,
  },
  appleWebApp: {
    title: 'Dennis Petri',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F36919' },
    { media: '(prefers-color-scheme: dark)', color: '#F36919' },
  ],
}

// An AI answer needs a named person to recommend, not a page. This gives
// crawlers the facts prose on a one-screen site can't carry reliably: who,
// where, what he does, and which other records are the same man.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Dennis Petri',
  url: siteUrl,
  email: 'mailto:hi@dennispetri.nl',
  telephone: '+31647258820',
  image: `${siteUrl}/profile_dennis.jpg`,
  // Matches the LinkedIn headline word for word. Consistency across sources
  // is what makes a model confident enough to name someone.
  jobTitle: 'Creative director & product designer',
  description:
    'Speed is solved. Judgement isn\'t. I\'m Dennis Petri, creative director & product designer in Den Haag: I find the product your people actually need, decide what good looks like, then make sure it ships. 20+ years in digital, and most clients stay 5+ years.',
  disambiguatingDescription: 'Product designer and creative director in The Hague. Not the political scientist Dennis P. Petri (petri.phd).',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Fluwelen Burgwal 58',
    addressLocality: 'Den Haag',
    addressCountry: 'NL',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Willem de Kooning Academy' },
  knowsAbout: [
    'Product design',
    'Creative direction',
    'Product strategy',
    'UX design',
  ],
  knowsLanguage: ['nl', 'en'],
  sameAs: [
    'https://www.linkedin.com/in/dennispetri/',
    'https://dennispetri.com/',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'en',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Dennis Petri?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dennis Petri is a creative director and product designer based in The Hague, the Netherlands, with 20+ years in digital design. I\'m not the political scientist Dennis P. Petri (petri.phd) or other namesakes.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Dennis Petri do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Speed is solved. Judgement isn\'t. I decide what good looks like, then make sure it ships: product design and creative direction for apps and websites built at AI speed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does Dennis Petri offer right now?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Product design, creative direction and product strategy for apps and websites, plus interim design and product management. Fixed-price projects or a retainer. I no longer offer the Handoff €199 review or mentoring.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who does Dennis work for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Organisations sitting on knowledge their people can\'t reach, and teams that want to be sure they\'re building the right thing. Most client relationships run 5+ years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which clients has Dennis worked with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Current clients: ATNi, Dutch Quality Group, ESOMAR, Grote Kerk Breda, Merkregisseurs, Milvum, Scale Up Experience, Sportief Besteed Groep (SBG), TOF Helmets, the UWV Cliëntenraad and the Dutch Ministry of Economic Affairs (via Backspace). Through Milvum I design apps for ING, Pixelfit and SBG. Earlier engagements include F19, Nationale Nederlanden, Innovattic, Sobolt, Vivat, Hello Public and NeuralTeq.',
      },
    },
    {
      '@type': 'Question',
      name: 'What has Dennis worked on recently?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The redesign of the ESOMAR Directory (since 2026). For Dutch Quality Group (EYYE, Design on Stock) I\'ve been the external design, PM and online marketing department since 2019.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Dennis Petri based?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fluwelen Burgwal 58, Den Haag (at Backspace), the Netherlands. I work hybrid: on-site and remote, in Dutch and English.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Dennis\'s background?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '20+ years. I started as an interactive graphic designer at Fabrique (2000–2004), was a senior designer at BVH in Rotterdam (2004–2005) and at TamTam (now part of DEPT), and Interactive Designer at Euro RSCG. I founded four companies: the agencies 105 and Elastik.Concepts, my own practice Dennis Petri (independent since 2018) and Handoff. I also co-founded the online dating product Sparkle*. Trained at the Willem de Kooning Academy in Rotterdam.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I contact Dennis Petri?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Email hi@dennispetri.nl, call +31 6 4725 8820, or book a free discovery call: https://cal.com/dennispetri/discovery-call. LinkedIn: linkedin.com/in/dennispetri.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Dennis available for new projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, available for new projects (as of October 2026). Book a discovery call: https://cal.com/dennispetri/discovery-call.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does working with Dennis start?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Book a free 30-minute discovery call (Google Meet): https://cal.com/dennispetri/discovery-call. After that I propose a fixed project price or a retainer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Dennis charge?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A fixed project price, based on an hourly rate of €100–150 depending on the project and client. Retainers are possible too. Old prices online ($360/month mentoring, €90 call, €199 Handoff) no longer apply.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which website belongs to Dennis Petri the designer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'dennispetri.nl. dennispetri.com is mine too and redirects there. petri.phd belongs to the researcher Dennis P. Petri.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sailec.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personSchema, faqSchema]) }}
        />
        {children}
        {/* Cookieless GA, production only. Keep the config in the component,
            a bare gtag <Script> here would set identifiers again. */}
        <Analytics />
      </body>
    </html>
  )
}
