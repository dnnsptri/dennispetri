import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://dennispetri.nl'
const siteTitle = 'Dennis Petri, product design & creative direction'
const siteDescription =
  'Creative direction and product design. I decide what good looks like, and make sure it ships. Based in The Hague.'

export const metadata: Metadata = {
  // Static export has no request context. metadataBase covers most resolution,
  // but dev overrides it with the local origin, so OG image URLs are written
  // absolute to guarantee scrapers always get the production host.
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
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
  manifest: '/manifest.json',
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZVWK9LNYE0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZVWK9LNYE0');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}