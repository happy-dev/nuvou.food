import { describe, expect, it } from 'vitest'

import { fromPriceInCents, mostOrdered, type MenuRecipe } from './menu'
import type { PricingSettings } from './pricing'

const settings: PricingSettings = {
  defaultPrices: {
    main: { small: 3, medium: 8, large: 13 },
    rice: { small: 1.5, medium: 3, large: 5 },
    salad: { small: 3, medium: 8, large: 13 },
  },
  portions: { small: 1, medium: 4, large: 7 },
  deliveryFee: 5,
  freeDeliveryThreshold: 30,
}

const recipe = (id: number, over: Partial<MenuRecipe> = {}): MenuRecipe => ({
  id,
  type: 'main',
  featured: false,
  stock: { small: 1, medium: 1, large: 1 },
  ...over,
})

describe('mostOrdered', () => {
  it('shows products in stock only', () => {
    const out = recipe(2, { stock: { small: 0, medium: 0, large: 0 } })
    expect(mostOrdered([recipe(1), out]).map((r) => r.id)).toEqual([1])
  })

  it('puts featured products first, then the most ordered', () => {
    const recipes = [recipe(1), recipe(2), recipe(3, { featured: true }), recipe(4)]
    const orderCounts = { 1: 2, 2: 10, 4: 5 }
    expect(mostOrdered(recipes, { orderCounts }).map((r) => r.id)).toEqual([3, 2, 4, 1])
  })

  it('keeps the given order on ties, and applies the limit', () => {
    expect(mostOrdered([recipe(1), recipe(2), recipe(3)], { limit: 2 }).map((r) => r.id)).toEqual([1, 2])
  })
})

describe('fromPriceInCents', () => {
  it('is the cheapest size in stock', () => {
    expect(fromPriceInCents(recipe(1), settings)).toBe(300)
    expect(fromPriceInCents(recipe(1, { stock: { small: 0, medium: 2, large: 1 } }), settings)).toBe(800)
  })

  it('uses the recipe price overrides', () => {
    expect(fromPriceInCents(recipe(1, { priceOverrides: { small: 3.5 } }), settings)).toBe(350)
  })

  it('is null when out of stock', () => {
    expect(fromPriceInCents(recipe(1, { stock: { small: 0, medium: 0, large: 0 } }), settings)).toBeNull()
  })
})
