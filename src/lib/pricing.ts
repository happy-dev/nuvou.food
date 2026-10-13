// Prices: pure functions, no database access, so they can be unit-tested.
// Prices are entered in euros in the admin; all arithmetic happens in cents
// (integers) to avoid floating-point rounding errors.

export const SIZES = ['small', 'medium', 'large'] as const
export type Size = (typeof SIZES)[number]

export const PRODUCT_TYPES = ['main', 'rice', 'salad'] as const
export type ProductType = (typeof PRODUCT_TYPES)[number]

/** Euros, as stored in the admin. `null`/`undefined` means "not set". */
type Euros = number | null | undefined

export type SizePrices = Partial<Record<Size, Euros>>

export type PricingSettings = {
  /** Default price per product type and size (SiteSettings). */
  defaultPrices: Record<ProductType, SizePrices>
  /** Approximate number of adult portions per size (SiteSettings). */
  portions: Record<Size, number>
  deliveryFee: number
  freeDeliveryThreshold: number
}

export type PricedRecipe = {
  type: ProductType
  /** Optional per-recipe prices that override the defaults. */
  priceOverrides?: SizePrices | null
}

export const toCents = (euros: number): number => Math.round(euros * 100)

/** Price of a recipe in a given size, in cents: the recipe's override wins over the default. */
export function priceInCents(recipe: PricedRecipe, size: Size, settings: PricingSettings): number {
  const override = recipe.priceOverrides?.[size]
  const euros = override ?? settings.defaultPrices[recipe.type][size]
  if (euros == null) {
    throw new Error(`No price for a ${recipe.type} in size ${size}: set a default in Site settings`)
  }
  return toCents(euros)
}

/** Price per adult portion, in cents, rounded to the nearest cent. */
export function pricePerPortionInCents(priceCents: number, size: Size, settings: PricingSettings): number {
  return Math.round(priceCents / settings.portions[size])
}

/**
 * Price per person of a complete dinner (main dish + rice + salad, default
 * prices) in a given size. This is the "€4.75 per person" of the marketing copy.
 */
export function completeDinnerPerPersonInCents(settings: PricingSettings, size: Size = 'medium'): number {
  const total = (['main', 'rice', 'salad'] as const).reduce(
    (sum, type) => sum + priceInCents({ type }, size, settings),
    0,
  )
  return Math.round(total / settings.portions[size])
}

/** Delivery fee in cents for a cart subtotal (products only): free from the threshold up. */
export function deliveryFeeInCents(subtotalCents: number, settings: PricingSettings): number {
  return subtotalCents >= toCents(settings.freeDeliveryThreshold) ? 0 : toCents(settings.deliveryFee)
}

/** How much is left to reach free delivery, in cents (0 once reached). */
export function remainingForFreeDeliveryInCents(subtotalCents: number, settings: PricingSettings): number {
  return Math.max(0, toCents(settings.freeDeliveryThreshold) - subtotalCents)
}

/** "4,75 €" in Portuguese, "€4.75" in English. */
export function formatPrice(cents: number, locale: 'pt' | 'en'): string {
  return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}
