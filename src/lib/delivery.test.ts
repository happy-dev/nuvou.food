import { describe, expect, it } from 'vitest'

import { deliverySlotFor, type DeliverySettings } from './delivery'

// Mon–Fri, same-day delivery for orders before 16:30 (Lisbon time).
const settings: DeliverySettings = { deliveryDays: [1, 2, 3, 4, 5], sameDayCutoff: '16:30' }

// Instants are given in UTC. In October 2026 Lisbon is UTC+1 (summer time until
// 25 October); in January it's UTC+0. 2026-10-12 is a Monday.
const at = (iso: string) => deliverySlotFor(new Date(iso), settings)

describe('deliverySlotFor', () => {
  it('delivers today when ordered on a weekday before 16:30', () => {
    expect(at('2026-10-12T15:29:00Z')).toEqual({ date: '2026-10-12', weekday: 1, isToday: true }) // 16:29 Lisbon
  })

  it('moves to the next day at 16:30 sharp', () => {
    expect(at('2026-10-12T15:30:00Z')).toEqual({ date: '2026-10-13', weekday: 2, isToday: false }) // 16:30 Lisbon
  })

  it('moves from Friday evening to Monday', () => {
    expect(at('2026-10-16T18:00:00Z').date).toBe('2026-10-19')
  })

  it('moves weekend orders to Monday', () => {
    expect(at('2026-10-17T09:00:00Z').date).toBe('2026-10-19') // Saturday
    expect(at('2026-10-18T09:00:00Z').date).toBe('2026-10-19') // Sunday
  })

  it('uses Lisbon time, not UTC, in winter too', () => {
    expect(at('2026-01-14T16:29:00Z').isToday).toBe(true) // Wednesday 16:29 Lisbon (UTC+0)
    expect(at('2026-01-14T16:31:00Z').isToday).toBe(false)
  })

  it('handles the late-evening UTC/Lisbon date difference', () => {
    // 23:30 UTC on Sunday 18 Oct = 00:30 Lisbon on Monday 19 Oct, before the cut-off
    expect(at('2026-10-18T23:30:00Z')).toEqual({ date: '2026-10-19', weekday: 1, isToday: true })
  })
})

describe('closed periods', () => {
  const withClosed = (closedPeriods: DeliverySettings['closedPeriods']) => (iso: string) =>
    deliverySlotFor(new Date(iso), { ...settings, closedPeriods })

  it('skips a closed day, even before the cut-off (Christmas, a Friday in 2026)', () => {
    const at = withClosed([{ from: '2026-12-25', until: '2026-12-25' }])
    expect(at('2026-12-25T10:00:00Z')).toEqual({ date: '2026-12-28', weekday: 1, isToday: false })
  })

  it('skips a whole holiday period, both ends included', () => {
    const at = withClosed([{ from: '2026-08-03', until: '2026-08-14' }]) // Mon 3 – Fri 14 August
    expect(at('2026-07-31T18:00:00Z').date).toBe('2026-08-17') // Friday evening before → Monday after
    expect(at('2026-08-14T09:00:00Z').date).toBe('2026-08-17') // last closed day
  })

  it('stops searching after a year if everything is closed by mistake', () => {
    const at = withClosed([{ from: '2026-01-01', until: '2030-12-31' }])
    expect(() => at('2026-10-12T09:00:00Z')).toThrow(/check closed dates/)
  })
})
