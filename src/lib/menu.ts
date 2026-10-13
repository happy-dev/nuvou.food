import { priceInCents, SIZES, type PricedRecipe, type PricingSettings, type Size } from './pricing'

// Which products to show, and in what order. Pure functions, no database access.

export type MenuRecipe = PricedRecipe & {
  id: number | string
  featured?: boolean | null
  /** Containers in stock per size. */
  stock: Record<Size, number>
}

/** Sizes with at least one container in stock. */
export const sizesInStock = (recipe: MenuRecipe): Size[] => SIZES.filter((size) => recipe.stock[size] > 0)

export const isInStock = (recipe: MenuRecipe): boolean => sizesInStock(recipe).length > 0

/** The "from" price of a card: the cheapest size in stock, in cents (null when out of stock). */
export function fromPriceInCents(recipe: MenuRecipe, settings: PricingSettings): number | null {
  const prices = sizesInStock(recipe).map((size) => priceInCents(recipe, size, settings))
  return prices.length ? Math.min(...prices) : null
}

/**
 * "Most ordered" (Home) and "Complete your meal": in stock only, "featured"
 * first, then by number of paid orders. Ties keep the given order.
 */
export function mostOrdered<T extends MenuRecipe>(
  recipes: T[],
  { orderCounts = {}, limit }: { orderCounts?: Record<string, number>; limit?: number } = {},
): T[] {
  const orders = (r: T) => orderCounts[String(r.id)] ?? 0
  return recipes
    .filter(isInStock)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || orders(b) - orders(a))
    .slice(0, limit)
}
