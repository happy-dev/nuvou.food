import { SIZES, type Size } from './pricing'

// Stock arithmetic for the stock log: pure functions, no database access.

export type SizeQuantities = Partial<Record<Size, number | null>>

export type Direction = 'add' | 'remove'

export type Movement = {
  direction: Direction
  quantities: SizeQuantities
}

/**
 * Why stock changes, and which way each reason moves it. `null` = the admin
 * chooses (a correction can go either way). Order matters: it's the order of
 * the admin dropdown. Paid orders will add an automatic "order" reason in Phase 5.
 */
export const STOCK_REASONS = {
  'own-use': 'remove',
  'direct-sale': 'remove', // sold outside the site (MB WAY, cash…); site orders are automatic
  production: 'add',
  loss: 'remove',
  correction: null,
} as const satisfies Record<string, Direction | null>

export type StockReason = keyof typeof STOCK_REASONS

/** The direction an entry moves stock: set by its reason, or chosen for a correction. */
export function directionFor(reason: StockReason, chosen?: Direction | null): Direction {
  const fixed = STOCK_REASONS[reason]
  if (fixed) return fixed
  if (!chosen) throw new StockError('Choose whether this correction adds to or removes from stock.')
  return chosen
}

/**
 * New stock after applying a movement (or reversing it, when an entry is
 * deleted). Refuses to go below zero: you can't remove containers that don't
 * exist, nor delete a production entry whose portions were already sold.
 */
export function applyMovement(
  stock: SizeQuantities,
  movement: Movement,
  { reverse = false }: { reverse?: boolean } = {},
): Record<Size, number> {
  const sign = (movement.direction === 'add' ? 1 : -1) * (reverse ? -1 : 1)
  const result = {} as Record<Size, number>
  for (const size of SIZES) {
    const next = (stock[size] ?? 0) + sign * (movement.quantities[size] ?? 0)
    if (next < 0) {
      throw new StockError(`Not enough stock in size ${size.toUpperCase()}: only ${stock[size] ?? 0} left.`)
    }
    result[size] = next
  }
  return result
}

/** Raised when a movement would make stock negative. Its message is shown in the admin. */
export class StockError extends Error {
  name = 'StockError'
}
