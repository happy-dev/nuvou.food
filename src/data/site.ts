import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/lib/format'

// The public site reads its content here, and only here, through Payload's
// Local API (a direct database call, no HTTP). Each function is wrapped in
// React's cache(), so a page and its layout share one query per request.
//
// overrideAccess: false applies the same access rules as the public API, so
// internal fields (chef notes, source links, ingredient units) never reach a page.

const payload = () => getPayload({ config })

export const getSiteSettings = cache(async (locale: Locale) =>
  (await payload()).findGlobal({ slug: 'site-settings', locale, overrideAccess: false }),
)

export const getHomePage = cache(async (locale: Locale) =>
  (await payload()).findGlobal({ slug: 'home-page', locale, depth: 1, overrideAccess: false }),
)

/** Every recipe, with its photos and notable nutrients. The menu is small, so no paging. */
export const getRecipes = cache(async (locale: Locale) => {
  const { docs } = await (await payload()).find({
    collection: 'recipes',
    locale,
    depth: 1,
    pagination: false,
    sort: 'name',
    overrideAccess: false,
  })
  return docs
})

/** Health tags, with their nutrients (to infer a recipe's tags and name the nutrients). */
export const getHealthTags = cache(async (locale: Locale) => {
  const { docs } = await (await payload()).find({
    collection: 'health-tags',
    locale,
    depth: 1,
    pagination: false,
    overrideAccess: false,
  })
  return docs
})
