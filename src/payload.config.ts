import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { HealthTags } from './collections/HealthTags'
import { Ingredients } from './collections/Ingredients'
import { Media } from './collections/Media'
import { Nutrients } from './collections/Nutrients'
import { Recipes } from './collections/Recipes'
import { StockMovements } from './collections/StockMovements'
import { Units } from './collections/Units'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Nuvou admin',
    },
  },
  // Content fields marked `localized: true` get one value per language, with a
  // PT/EN switch in the admin. When an English value is missing, Portuguese is shown.
  localization: {
    locales: [
      { label: 'Português', code: 'pt' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'pt',
    fallback: true,
  },
  // The order here is the order in the admin sidebar, within each group.
  collections: [Recipes, StockMovements, Ingredients, Units, Nutrients, HealthTags, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
