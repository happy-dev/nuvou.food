import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { slugify } from '@/lib/slugify'

// Notable nutrients (iron, vitamin C, omega-3…), maintained once. Recipes tick
// the ones they're a good source of; health tags list the nutrients that
// trigger them, so a recipe's tags are inferred (src/lib/healthTags.ts).
export const Nutrients: CollectionConfig = {
  slug: 'nutrients',
  labels: { singular: 'Nutrient', plural: 'Nutrients' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'benefit'],
    group: 'Ingredients & nutrition',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Ferro" / "Iron"' } },
    {
      name: 'benefit',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional, shown on the site: what it does, in a few words. e.g. "Transporta o oxigénio no sangue"',
        components: { Cell: '/components/admin/PlainTextCell#PlainTextCell' },
      },
    },
    slugField({ useAsSlug: 'name', slugify: ({ valueToSlugify }) => slugify(String(valueToSlugify ?? '')), position: 'sidebar' }),
  ],
}
