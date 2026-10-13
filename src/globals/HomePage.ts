import type { Field, GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { COPY_HELP, copyField } from '@/fields/copy'
import { revalidateGlobal } from '@/hooks/revalidateSite'

const image = (name: string, description?: string): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  admin: { description },
})

// The four promises share an eyebrow ("Faster": the site adds "01 ·") and a title.
const eyebrowAndTitle: Field[] = [
  {
    type: 'row',
    fields: [
      copyField({ name: 'eyebrow', width: '30%', description: 'Short label; the site numbers it.' }),
      copyField({ name: 'title', width: '70%' }),
    ],
  },
]

// The marketing copy and images of the Home page, one version per language.
// The layout and order of the sections stay in code
// (src/app/(site)/[locale]/page.tsx); buttons and labels are interface texts in
// messages/*.json. Each tab is one section of the page, top to bottom.
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { description: COPY_HELP },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero',
          fields: [
            copyField({ name: 'headline', description: 'Wrap the words to highlight in *stars*.' }),
            copyField({ name: 'subtitle', long: true }),
            image('image', 'Food photo behind the brand block. Wide, landscape.'),
          ],
        },
        {
          name: 'howItWorks',
          label: 'How it works',
          fields: [
            copyField({ name: 'title' }),
            {
              name: 'steps',
              type: 'array',
              minRows: 3,
              maxRows: 3,
              labels: { singular: 'Step', plural: 'Steps' },
              fields: [copyField({ name: 'title' }), copyField({ name: 'text', long: true })],
            },
          ],
        },
        {
          name: 'faster',
          label: '1 · Faster',
          fields: [...eyebrowAndTitle, copyField({ name: 'text', long: true }), image('image')],
        },
        {
          name: 'cheaper',
          label: '2 · Cheaper',
          fields: [
            ...eyebrowAndTitle,
            copyField({ name: 'text', long: true }),
            {
              name: 'takeaway',
              type: 'array',
              label: 'Takeaway receipt',
              labels: { singular: 'Line', plural: 'Lines' },
              admin: {
                description:
                  'A typical family takeaway order, for the receipts visual. Both receipts are divided by the M portions. Leave the delivery fee out: the Nuvou price per person leaves delivery out too, so the comparison stays fair.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'item', type: 'text', localized: true, required: true, admin: { width: '70%' } },
                    { name: 'amount', type: 'number', label: 'Amount (€)', min: 0, required: true, admin: { width: '30%', step: 0.01 } },
                  ],
                },
              ],
            },
            {
              name: 'nuvouReceipt',
              type: 'group',
              label: 'Nuvou receipt',
              admin: {
                description:
                  'Dish names shown on the Nuvou receipt (the size is added: "Caril de grão M"). Prices always come from the default M prices. Empty: the type is shown ("Prato M").',
              },
              fields: [
                {
                  type: 'row',
                  fields: (['main', 'rice', 'salad'] as const).map((type) => ({
                    name: type,
                    type: 'text' as const,
                    localized: true,
                    admin: { width: '33%' },
                  })),
                },
              ],
            },
          ],
        },
        {
          name: 'kids',
          label: '3 · Kid-approved',
          fields: [
            ...eyebrowAndTitle,
            copyField({ name: 'text', long: true }),
            copyField({ name: 'stamp', description: 'The round stamp, e.g. "Aprovado pelos miúdos ✓".' }),
            image('image'),
          ],
        },
        {
          name: 'healthy',
          label: '4 · Healthy',
          fields: [
            ...eyebrowAndTitle,
            copyField({ name: 'wholeFoodTitle', label: 'Card 1: title' }),
            copyField({ name: 'wholeFoodText', label: 'Card 1: text', long: true }),
            copyField({ name: 'balancedTitle', label: 'Card 2: title' }),
            copyField({
              name: 'balancedText',
              label: 'Card 2: text',
              long: true,
              description: 'Shown with the nutrition bar and health tags of a featured recipe.',
            }),
          ],
        },
        {
          name: 'planet',
          label: '5 · Planet',
          fields: [
            copyField({ name: 'eyebrow' }),
            copyField({ name: 'text', long: true, description: 'End with * to point to the footnote.' }),
            {
              type: 'row',
              fields: [
                { name: 'averageKg', type: 'number', label: 'Average meal (kg CO₂e)', required: true, admin: { width: '50%', step: 0.1 } },
                { name: 'oursKg', type: 'number', label: 'Nuvou meal (kg CO₂e)', required: true, admin: { width: '50%', step: 0.1 } },
              ],
            },
            copyField({ name: 'footnote', long: true }),
          ],
        },
        {
          name: 'mostOrdered',
          label: 'Most ordered',
          description: 'The products are picked automatically: in stock only, "featured" first, then the most ordered.',
          fields: [copyField({ name: 'title' })],
        },
        {
          name: 'story',
          label: 'Story',
          fields: [
            copyField({ name: 'eyebrow' }),
            copyField({ name: 'title' }),
            copyField({ name: 'text', long: true }),
            image('image'),
          ],
        },
        {
          name: 'testimonials',
          label: 'Testimonials',
          fields: [
            copyField({ name: 'title' }),
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Testimonial', plural: 'Testimonials' },
              fields: [
                image('photo', 'Optional, square. A child’s photo needs a parent’s consent.'),
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                    {
                      name: 'detail',
                      type: 'text',
                      localized: true,
                      admin: { width: '50%', description: 'Optional, e.g. "9 anos". For a child: first name and age only.' },
                    },
                  ],
                },
                copyField({
                  name: 'quote',
                  long: true,
                  description: 'In the language it was said; the other language version shows the translation.',
                }),
              ],
            },
          ],
        },
        {
          name: 'finalCall',
          label: 'Final call',
          description: 'The delivery facts above the title are computed from Site settings.',
          fields: [
            copyField({ name: 'smallPrint', long: true, required: false, description: 'Optional, under the delivery facts.' }),
            copyField({ name: 'title' }),
          ],
        },
      ],
    },
  ],
}
