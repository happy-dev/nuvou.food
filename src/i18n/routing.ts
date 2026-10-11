import { defineRouting } from 'next-intl/routing'

// The site's two languages. Portuguese is the default, and the visitor's browser
// language (Accept-Language) picks the version on the first visit.
// `pathnames` gives each language its own URLs: /pt/sobre-nos vs /en/about.
export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
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
