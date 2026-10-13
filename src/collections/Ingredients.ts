import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'

// Ingredients, entered once and reused by every recipe, each with its unit.
// Consistent names and units are what make a shopping list possible later.
// The name is shown on product pages (translated); the unit stays internal.
export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  labels: { singular: 'Ingredient', plural: 'Ingredients' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'unit'],
    group: 'Ingredients & nutrition',
    description: 'Every ingredient once, with the unit you measure it in. Recipes pick from this list.',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: revalidateHooks,
  defaultSort: 'name',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', localized: true, required: true, admin: { width: '60%', description: 'Shown on the site: translate it.' } },
        {
          name: 'unit',
          type: 'relationship',
          relationTo: 'units',
          required: true,
          // Internal: never returned by the public API.
          access: { read: ({ req }) => Boolean(req.user) },
          admin: { width: '40%', description: 'How you measure it. Recipes use this unit automatically.' },
        },
      ],
    },
  ],
}
