import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access'

// Units for ingredient quantities (g, ml, colher de sopa…), editable in the
// admin. Internal: in Portuguese, never shown on the site. Each ingredient has
// one unit, so quantities add up consistently (e.g. for a shopping list).
export const Units: CollectionConfig = {
  slug: 'units',
  labels: { singular: 'Unit', plural: 'Units' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'abbreviation'],
    group: 'Ingredients & nutrition',
    description: 'Units used for ingredient quantities (internal, in Portuguese).',
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  defaultSort: 'name',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, unique: true, admin: { width: '60%', description: 'e.g. "colher de sopa"' } },
        {
          name: 'abbreviation',
          type: 'text',
          admin: {
            width: '40%',
            description: 'Short form shown next to quantities, e.g. "c. sopa". Leave empty to use the name.',
            components: { Cell: '/components/admin/PlainTextCell#PlainTextCell' },
          },
        },
      ],
    },
  ],
}
