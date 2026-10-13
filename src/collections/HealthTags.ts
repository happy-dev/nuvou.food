import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { slugify } from '@/lib/slugify'

// "Good for" tags shown on product pages, e.g. "Ossos fortes". Not ticked on
// recipes: a recipe shows a tag when one of its notable nutrients is among the
// tag's nutrients (inferred, see src/lib/healthTags.ts).
export const HealthTags: CollectionConfig = {
  slug: 'health-tags',
  labels: { singular: 'Health tag', plural: 'Health tags' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['icon', 'name', 'nutrients'],
    group: 'Ingredients & nutrition',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Ossos fortes" / "Strong bones"' } },
    {
      name: 'nutrients',
      type: 'relationship',
      relationTo: 'nutrients',
      hasMany: true,
      required: true,
      admin: { description: 'A recipe shows this tag when it has at least one of these nutrients.' },
    },
    { name: 'description', type: 'textarea', localized: true, admin: { description: 'Optional one-line explanation.' } },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'An emoji, e.g. 🦴',
        position: 'sidebar',
        components: { Cell: '/components/admin/PlainTextCell#PlainTextCell' },
      },
    },
    slugField({ useAsSlug: 'name', slugify: ({ valueToSlugify }) => slugify(String(valueToSlugify ?? '')), position: 'sidebar' }),
  ],
}
