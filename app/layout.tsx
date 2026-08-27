import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from './components/Analytics'
import { siteDescription, siteTitle, siteUrl } from './site'

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'msapplication-TileColor': '#FFFF33',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'theme-color': '#FFFF33',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Cookieless GA, production only. Keep the config in the component,
            a bare gtag <Script> here would set identifiers again. */}
        <Analytics />
      </body>
    </html>
  )
}
