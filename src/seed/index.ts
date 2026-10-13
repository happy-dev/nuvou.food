// Fills the development database: real site settings, reference lists (units,
// nutrients, health tags, ingredients) and sample recipes with stand-in photos.
// Run with `npm run seed` (development only).
//
// Safe to re-run:
// - Site settings and reference lists are only created when missing, never
//   overwritten, so edits made in /admin survive.
// - Only recipes, stock entries and photos prefixed "exemplo-" are deleted and
//   recreated. Real content added in /admin is never touched.
// - The Home page copy is only filled in when empty, like the settings.
//
// To force the settings and/or the Home page (and its seed images) back to
// data.ts: `SEED_RESET=settings,home npm run seed`. (An environment variable,
// because `payload run` doesn't pass command-line arguments to the script.)

import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'
import {
  healthTags,
  homeImages,
  homePage,
  ingredients,
  nutrients,
  sampleRecipes,
  siteSettings,
  units,
  type HomeImageKey,
} from './data'

const SAMPLE_PREFIX = 'exemplo-'
const HOME_IMAGE_PREFIX = 'seed-home-'

/** A stand-in photo from Unsplash, as a file Payload can upload. */
async function unsplashPhoto(id: string, name: string) {
  const response = await fetch(`https://images.unsplash.com/photo-${id}?w=1600&q=75&auto=format&fit=crop&fm=jpg`)
  if (!response.ok) throw new Error(`Could not download the photo ${name} (${response.status})`)
  const data = Buffer.from(await response.arrayBuffer())
  return { data, mimetype: 'image/jpeg', name: `${name}.jpg`, size: data.length }
}

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed: NODE_ENV is "production". The seed is for the development database only.')
  process.exit(1)
}

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

const reset = (process.env.SEED_RESET ?? '').split(',').map((s) => s.trim())

// 1. Site settings, only if never filled in (or with SEED_RESET=settings).
// Localized storage texts: Portuguese first, then English.
const resetSettings = reset.includes('settings')
const current = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
if (!current.contactEmail || resetSettings) {
  const { storage, ...settings } = siteSettings
  await payload.updateGlobal({ slug: 'site-settings', locale: 'pt', data: { ...settings, ...storage.pt } })
  await payload.updateGlobal({ slug: 'site-settings', locale: 'en', data: storage.en })
  log(resetSettings ? 'site settings reset to the seed values' : 'site settings filled in')
} else {
  log('site settings already set: kept as they are (SEED_RESET=settings to overwrite)')
}

// 2. Reference lists: created when missing, never overwritten.

// Units, matched by name
const unitIds: Record<string, number> = {}
let created = 0
for (const unit of units) {
  const existing = (await payload.find({ collection: 'units', where: { name: { equals: unit.name } }, limit: 1 })).docs[0]
  unitIds[unit.name] = existing?.id ?? (created++, (await payload.create({ collection: 'units', data: unit })).id)
}
log(`units: ${created} created, ${units.length - created} kept`)

// Nutrients, matched by slug
const nutrientIds: Record<string, number> = {}
created = 0
for (const nutrient of nutrients) {
  const existing = (await payload.find({ collection: 'nutrients', where: { slug: { equals: nutrient.slug } }, limit: 1 })).docs[0]
  if (existing) {
    nutrientIds[nutrient.slug] = existing.id
    continue
  }
  const doc = await payload.create({
    collection: 'nutrients',
    locale: 'pt',
    data: { ...nutrient.pt, slug: nutrient.slug, generateSlug: false },
  })
  await payload.update({ collection: 'nutrients', id: doc.id, locale: 'en', data: nutrient.en })
  nutrientIds[nutrient.slug] = doc.id
  created++
}
log(`nutrients: ${created} created, ${nutrients.length - created} kept`)

// Health tags, matched by slug. An existing tag keeps its name and icon; its
// nutrients are only filled in if it has none yet.
created = 0
for (const tag of healthTags) {
  const tagNutrients = tag.nutrients.map((slug) => nutrientIds[slug])
  const existing = (await payload.find({ collection: 'health-tags', where: { slug: { equals: tag.slug } }, limit: 1, depth: 0 }))
    .docs[0]
  if (existing) {
    if (!existing.nutrients?.length) {
      await payload.update({ collection: 'health-tags', id: existing.id, data: { nutrients: tagNutrients } })
    }
    continue
  }
  const doc = await payload.create({
    collection: 'health-tags',
    locale: 'pt',
    data: { ...tag.pt, icon: tag.icon, nutrients: tagNutrients, slug: tag.slug, generateSlug: false },
  })
  await payload.update({ collection: 'health-tags', id: doc.id, locale: 'en', data: tag.en })
  created++
}
log(`health tags: ${created} created, ${healthTags.length - created} kept`)

// Ingredients, matched by Portuguese name
const ingredientIds: Record<string, number> = {}
created = 0
for (const ingredient of ingredients) {
  const existing = (
    await payload.find({ collection: 'ingredients', locale: 'pt', where: { name: { equals: ingredient.pt } }, limit: 1 })
  ).docs[0]
  if (existing) {
    ingredientIds[ingredient.pt] = existing.id
    continue
  }
  const doc = await payload.create({
    collection: 'ingredients',
    locale: 'pt',
    data: { name: ingredient.pt, unit: unitIds[ingredient.unit] },
  })
  await payload.update({ collection: 'ingredients', id: doc.id, locale: 'en', data: { name: ingredient.en } })
  ingredientIds[ingredient.pt] = doc.id
  created++
}
log(`ingredients: ${created} created, ${ingredients.length - created} kept`)

// 3. Remove previous samples: their stock log entries, the recipes, then their photos
const oldEntries = await payload.delete({
  collection: 'stock-movements',
  where: { 'recipe.slug': { like: SAMPLE_PREFIX } },
  context: { skipStockUpdate: true }, // the recipes are deleted right after
})
log(`removed ${oldEntries.docs.length} sample stock entries`)
const oldRecipes = await payload.delete({ collection: 'recipes', where: { slug: { like: SAMPLE_PREFIX } } })
const oldMedia = await payload.delete({ collection: 'media', where: { filename: { like: SAMPLE_PREFIX } } })
log(`removed ${oldRecipes.docs.length} sample recipes and ${oldMedia.docs.length} sample photos`)

// 4. Sample recipes, each with a stand-in photo downloaded from Unsplash
for (const recipe of sampleRecipes) {
  const photo = await payload.create({
    collection: 'media',
    locale: 'pt',
    data: { alt: recipe.pt.photoAlt },
    file: await unsplashPhoto(recipe.unsplashId, recipe.slug),
  })
  await payload.update({ collection: 'media', id: photo.id, locale: 'en', data: { alt: recipe.en.photoAlt } })

  const doc = await payload.create({
    collection: 'recipes',
    locale: 'pt',
    data: {
      name: recipe.pt.name,
      description: recipe.pt.description,
      servingSuggestion: recipe.pt.servingSuggestion,
      type: recipe.type,
      featured: recipe.featured,
      suggestRice: recipe.suggestRice,
      photos: [photo.id],
      stock: { small: 0, medium: 0, large: 0 }, // filled by the stock log entry below
      priceOverrides: recipe.priceOverrides,
      sourceLinks: recipe.sourceLinks?.map((url) => ({ url })),
      nutrition: recipe.nutrition,
      notableNutrients: recipe.notableNutrients.map((slug) => nutrientIds[slug]),
      ingredients: recipe.ingredients.map(({ ingredient, quantity }) => ({ ingredient: ingredientIds[ingredient], quantity })),
      slug: recipe.slug,
      generateSlug: false,
    },
  })
  await payload.update({
    collection: 'recipes',
    id: doc.id,
    locale: 'en',
    data: { name: recipe.en.name, description: recipe.en.description, servingSuggestion: recipe.en.servingSuggestion },
  })

  // Stock comes from the stock log, like in real life: one packed batch.
  if (Object.values(recipe.stock).some((n) => n > 0)) {
    await payload.create({
      collection: 'stock-movements',
      data: { recipe: doc.id, direction: 'add', reason: 'production', quantities: recipe.stock, note: 'Seed: sample batch' },
    })
  }
  log(`created ${recipe.slug}`)
}

// 5. Home page copy and images, only if never filled in (or with SEED_RESET=home)
const resetHome = reset.includes('home')
const currentHome = await payload.findGlobal({ slug: 'home-page', depth: 0 })
if (!currentHome.hero?.headline || resetHome) {
  await payload.delete({ collection: 'media', where: { filename: { like: HOME_IMAGE_PREFIX } } })

  // Upload each image (pt alt, then en alt). Files from inputs/ are private and
  // may be missing on another machine: those images are left empty.
  const imageIds: Partial<Record<HomeImageKey, number>> = {}
  for (const [key, image] of Object.entries(homeImages) as [HomeImageKey, (typeof homeImages)[HomeImageKey]][]) {
    const name = `${HOME_IMAGE_PREFIX}${key}`
    let file
    if ('unsplashId' in image) {
      file = await unsplashPhoto(image.unsplashId, name)
    } else if (existsSync(image.file)) {
      const data = await readFile(image.file)
      const ext = path.extname(image.file).slice(1).toLowerCase()
      file = { data, mimetype: ext === 'png' ? 'image/png' : 'image/jpeg', name: `${name}.${ext}`, size: data.length }
    } else {
      log(`home image "${key}" skipped: ${image.file} not found`)
      continue
    }
    const doc = await payload.create({ collection: 'media', locale: 'pt', data: { alt: image.alt.pt }, file })
    await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { alt: image.alt.en } })
    imageIds[key] = doc.id
  }

  type Copy = (typeof homePage)['pt']
  const withImages = (copy: Copy) => ({
    ...copy,
    hero: { ...copy.hero, image: imageIds.hero },
    faster: { ...copy.faster, image: imageIds.faster },
    kids: { ...copy.kids, image: imageIds.kids },
    story: { ...copy.story, image: imageIds.story },
    testimonials: {
      ...copy.testimonials,
      items: copy.testimonials.items.map((item) => ({ ...item, photo: item.photo ? imageIds[item.photo] : null })),
    },
  })

  await payload.updateGlobal({ slug: 'home-page', locale: 'pt', data: withImages(homePage.pt) })

  // The English update must reuse the rows created in Portuguese (same ids),
  // otherwise Payload would replace them and lose the Portuguese texts.
  const saved = await payload.findGlobal({ slug: 'home-page', locale: 'pt', depth: 0 })
  const sameRows = <T>(rows: T[], savedRows?: { id?: string | null }[] | null) =>
    rows.map((row, i) => ({ ...row, id: savedRows?.[i]?.id }))
  const en = withImages(homePage.en)
  await payload.updateGlobal({
    slug: 'home-page',
    locale: 'en',
    data: {
      ...en,
      howItWorks: { ...en.howItWorks, steps: sameRows(en.howItWorks.steps, saved.howItWorks.steps) },
      cheaper: { ...en.cheaper, takeaway: sameRows(en.cheaper.takeaway, saved.cheaper.takeaway) },
      testimonials: { ...en.testimonials, items: sameRows(en.testimonials.items, saved.testimonials.items) },
    },
  })
  log(resetHome ? 'home page reset to the seed copy' : 'home page filled in')
} else {
  log('home page already filled in: kept as it is (SEED_RESET=home to overwrite)')
}

log('done ✓')
process.exit(0)
