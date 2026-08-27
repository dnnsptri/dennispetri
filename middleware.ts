import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''
  if (process.env.VERCEL_ENV === 'production' && host.endsWith('.vercel.app')) {
    const url = new URL(req.url)
    url.protocol = 'https:'
    url.host = 'dennispetri.nl'
    url.port = ''
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}

export const config = { matcher: '/((?!_next|.*\\..*).*)' }
