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
// where, what he does, and which other records are the same man. The worksFor
// link to Handoff reuses handoff.nl's own @id, so both sites describe one
// person instead of two strangers with the same name.
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Dennis Petri',
  url: siteUrl,
  email: 'hi@dennispetri.nl',
  image: `${siteUrl}/profile_dennis.jpg`,
  // Matches the LinkedIn headline word for word. Consistency across sources
  // is what makes a model confident enough to name someone.
  jobTitle: 'Creative director & product designer',
  description:
    'Creative director and product designer in The Hague. He finds the product an organisation\'s people actually need, decides what good looks like, and makes sure it ships.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'The Hague',
    addressCountry: 'NL',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Willem de Kooning Academy' },
  knowsAbout: [
    'Product design',
    'Product strategy',
    'Creative direction',
    'AI product prototyping',
    'Knowledge management products',
  ],
  // schema.org has no 'founded' on Person; founder lives on Handoff's side.
  worksFor: {
    '@type': 'Organization',
    '@id': 'https://handoff.nl/#org',
    name: 'Handoff',
    url: 'https://handoff.nl',
  },
  sameAs: ['https://www.linkedin.com/in/dennispetri/'],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
        {/* Cookieless GA, production only. Keep the config in the component,
            a bare gtag <Script> here would set identifiers again. */}
        <Analytics />
      </body>
    </html>
  )
}
