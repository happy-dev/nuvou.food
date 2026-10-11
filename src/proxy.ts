import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

// Runs before each page request (Next.js 16 calls this file "proxy", formerly
// "middleware"). It redirects "/" to "/pt" or "/en" based on the browser language,
// and remembers the visitor's choice in a cookie.
export default createMiddleware(routing)

export const config = {
  // Everything except the Payload admin and API, Next.js internals and static files.
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
