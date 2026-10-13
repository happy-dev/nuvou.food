import { describe, expect, it } from 'vitest'

import { applyMovement, directionFor, StockError } from './stock'

describe('directionFor', () => {
  it('derives the direction from the reason', () => {
    expect(directionFor('production')).toBe('add')
    expect(directionFor('own-use')).toBe('remove')
    expect(directionFor('direct-sale')).toBe('remove')
    expect(directionFor('loss')).toBe('remove')
  })

  it('ignores a chosen direction when the reason fixes it', () => {
    expect(directionFor('own-use', 'add')).toBe('remove')
  })

  it('uses the chosen direction for a correction, and requires one', () => {
    expect(directionFor('correction', 'add')).toBe('add')
    expect(() => directionFor('correction')).toThrow(StockError)
  })
})

describe('applyMovement', () => {
  it('adds a packed batch to the stock', () => {
    const stock = { small: 2, medium: 0, large: 1 }
    expect(applyMovement(stock, { direction: 'add', quantities: { small: 10, medium: 5, large: 3 } })).toEqual({
      small: 12,
      medium: 5,
      large: 4,
    })
  })

  it('removes a loss, treating empty sizes as 0', () => {
    expect(applyMovement({ small: 6 }, { direction: 'remove', quantities: { small: 2 } })).toEqual({
      small: 4,
      medium: 0,
      large: 0,
    })
  })

  it('reverses an entry when it is deleted', () => {
    const stock = { small: 12, medium: 5, large: 4 }
    const batch = { direction: 'add' as const, quantities: { small: 10, medium: 5, large: 3 } }
    expect(applyMovement(stock, batch, { reverse: true })).toEqual({ small: 2, medium: 0, large: 1 })
  })

  it('refuses to remove more than is in stock', () => {
    expect(() => applyMovement({ medium: 1 }, { direction: 'remove', quantities: { medium: 2 } })).toThrow(StockError)
  })

  it('refuses to delete a batch whose portions were already sold', () => {
    const batch = { direction: 'add' as const, quantities: { large: 3 } }
    expect(() => applyMovement({ large: 1 }, batch, { reverse: true })).toThrow(/only 1 left/)
  })
})
