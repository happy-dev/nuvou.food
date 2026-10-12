import { defineRouting } from 'next-intl/routing'

// The site's two languages. On the first visit, the browser language
// (Accept-Language) picks the version: Portuguese browsers get /pt, every other
// language falls back to English (defaultLocale).
// `pathnames` gives each language its own URLs: /pt/sobre-nos vs /en/about.
export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'en',
  // Remembers the visitor's language choice (e.g. after clicking "English") in a
  // "NEXT_LOCALE" cookie, set by the proxy. It's a functional preference cookie,
  // so no consent banner is needed. next-intl's default is a session cookie;
  // we keep it for a year so the choice survives the next visit.
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
  pathnames: {
    '/': '/',
    '/menu': '/menu',
    '/about': {
      pt: '/sobre-nos',
      en: '/about',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
