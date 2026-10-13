import { describe, expect, it } from 'vitest'

import { toDeliverySettings } from './settings'

const base = {
  portions: { small: 1, medium: 4, large: 7 },
  defaultPrices: {
    main: { small: 3, medium: 8, large: 13 },
    rice: { small: 1.5, medium: 3, large: 4.5 },
    salad: { small: 3, medium: 8, large: 13 },
  },
  deliveryFee: 5,
  freeDeliveryThreshold: 30,
  deliveryDays: ['1', '2', '3', '4', '5'] as ('1' | '2' | '3' | '4' | '5')[],
  sameDayCutoff: '16:30',
}

describe('toDeliverySettings', () => {
  it('turns stored timestamps into Lisbon calendar days, whatever time Payload stored', () => {
    const settings = toDeliverySettings({
      ...base,
      closedDates: [
        // A day picked in the admin may be stored at noon UTC…
        { from: '2026-12-25T12:00:00.000Z', until: '2026-12-25T12:00:00.000Z' },
        // …or at Lisbon midnight, which is 23:00 UTC the day before in summer.
        { from: '2026-08-02T23:00:00.000Z', until: '2026-08-13T23:00:00.000Z' },
      ],
    })
    expect(settings.closedPeriods).toEqual([
      { from: '2026-12-25', until: '2026-12-25' },
      { from: '2026-08-03', until: '2026-08-14' },
    ])
    expect(settings.deliveryDays).toEqual([1, 2, 3, 4, 5])
  })

  it('accepts no closed dates', () => {
    expect(toDeliverySettings({ ...base, closedDates: null }).closedPeriods).toEqual([])
  })
})
