import { describe, expect, it } from 'vitest'

import {
  completeDinnerPerPersonInCents,
  deliveryFeeInCents,
  formatPrice,
  priceInCents,
  pricePerPortionInCents,
  remainingForFreeDeliveryInCents,
  type PricingSettings,
} from './pricing'

// The prices decided with Alex on 2026-10-11 (see CLAUDE.md and COPY.md).
const settings: PricingSettings = {
  defaultPrices: {
    main: { small: 3, medium: 8, large: 13 },
    salad: { small: 3, medium: 8, large: 13 },
    rice: { small: 1.5, medium: 3, large: 4.5 },
  },
  portions: { small: 1, medium: 4, large: 7 },
  deliveryFee: 5,
  freeDeliveryThreshold: 30,
}

describe('priceInCents', () => {
  it('uses the default price for the type and size', () => {
    expect(priceInCents({ type: 'main' }, 'medium', settings)).toBe(800)
    expect(priceInCents({ type: 'rice' }, 'small', settings)).toBe(150)
  })

  it("uses the recipe's override when set, and the default for other sizes", () => {
    const recipe = { type: 'main' as const, priceOverrides: { large: 14.5, medium: null } }
    expect(priceInCents(recipe, 'large', settings)).toBe(1450)
    expect(priceInCents(recipe, 'medium', settings)).toBe(800)
  })

  it('fails loudly when no price exists', () => {
    const incomplete = { ...settings, defaultPrices: { ...settings.defaultPrices, rice: {} } }
    expect(() => priceInCents({ type: 'rice' }, 'small', incomplete)).toThrow(/No price/)
  })
})

describe('per-portion and per-person prices', () => {
  it('gives €1.86 per portion for a large main dish', () => {
    expect(pricePerPortionInCents(1300, 'large', settings)).toBe(186)
  })

  it('gives €4.75 per person for a complete medium dinner (the marketing figure)', () => {
    expect(completeDinnerPerPersonInCents(settings)).toBe(475)
  })

  it('gives €4.36 per person with large sizes', () => {
    expect(completeDinnerPerPersonInCents(settings, 'large')).toBe(436)
  })
})

describe('delivery fee', () => {
  it('charges €5 below €30 of products', () => {
    expect(deliveryFeeInCents(2999, settings)).toBe(500)
  })

  it('is free from €30 of products', () => {
    expect(deliveryFeeInCents(3000, settings)).toBe(0)
  })

  it('says how much is left for free delivery', () => {
    expect(remainingForFreeDeliveryInCents(2400, settings)).toBe(600)
    expect(remainingForFreeDeliveryInCents(3500, settings)).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats in Portuguese and English', () => {
    expect(formatPrice(475, 'pt')).toMatch(/^4,75\s€$/)
    expect(formatPrice(475, 'en')).toBe('€4.75')
  })
})
