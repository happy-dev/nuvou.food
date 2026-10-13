// Fills the development database: real site settings, reference lists (units,
// nutrients, health tags, ingredients) and sample recipes with stand-in photos.
// Run with `npm run seed` (development only).
//
// Safe to re-run:
// - Site settings and reference lists are only created when missing, never
//   overwritten, so edits made in /admin survive. To force the settings back
//   to the values in data.ts: `npm run seed -- --reset-settings`.
// - Only recipes, stock entries and photos prefixed "exemplo-" are deleted and
//   recreated. Real content added in /admin is never touched.

import { getPayload } from 'payload'

import config from '../payload.config'
import { healthTags, ingredients, nutrients, sampleRecipes, siteSettings, units } from './data'

const SAMPLE_PREFIX = 'exemplo-'

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed: NODE_ENV is "production". The seed is for the development database only.')
  process.exit(1)
}

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

// 1. Site settings, only if never filled in (or with --reset-settings).
// Localized storage texts: Portuguese first, then English.
const resetSettings = process.argv.includes('--reset-settings')
const current = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
if (!current.contactEmail || resetSettings) {
  const { storage, ...settings } = siteSettings
  await payload.updateGlobal({ slug: 'site-settings', locale: 'pt', data: { ...settings, ...storage.pt } })
  await payload.updateGlobal({ slug: 'site-settings', locale: 'en', data: storage.en })
  log(resetSettings ? 'site settings reset to the seed values' : 'site settings filled in')
} else {
  log('site settings already set: kept as they are (use --reset-settings to overwrite)')
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
  const response = await fetch(`https://images.unsplash.com/photo-${recipe.unsplashId}?w=1600&q=75&auto=format&fit=crop&fm=jpg`)
  if (!response.ok) throw new Error(`Could not download the photo for ${recipe.slug} (${response.status})`)
  const data = Buffer.from(await response.arrayBuffer())

  const photo = await payload.create({
    collection: 'media',
    locale: 'pt',
    data: { alt: recipe.pt.photoAlt },
    file: { data, mimetype: 'image/jpeg', name: `${recipe.slug}.jpg`, size: data.length },
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

log('done ✓')
process.exit(0)
