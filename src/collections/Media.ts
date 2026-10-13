import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'

// Uploaded images (dish photos, testimonials, About us). Public to read, so the
// site can show them; only admins can upload or change them. Next.js's <Image>
// resizes them for each screen, so no extra sizes are generated here.
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'What the image shows, for screen readers and Google. One version per language.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
