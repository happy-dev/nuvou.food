import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// The public pages are pre-rendered (fast, and no database query per visitor).
// When content they show changes in /admin, these hooks ask Next.js to rebuild
// them on the next visit. The whole site is refreshed: it's small, and a
// recipe or a setting can appear on several pages.

function revalidateSite() {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (e.g. `npm run seed`): nothing is cached there.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

/** For collections whose content the public pages show: `hooks: revalidateHooks`. */
export const revalidateHooks = { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] }

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}
