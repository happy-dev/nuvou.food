import { describe, expect, it } from 'vitest'

import { formatAmount, formatDays, formatDeliveryDay, formatKg, formatTime } from './format'

describe('formatDeliveryDay', () => {
  // 2026-10-16 is a Friday
  it('says tomorrow for the next day', () => {
    expect(formatDeliveryDay('2026-10-17', '2026-10-16', 'pt', 'amanhã')).toBe('amanhã')
  })

  it('gives the weekday within a week', () => {
    expect(formatDeliveryDay('2026-10-19', '2026-10-16', 'pt', 'amanhã')).toBe('segunda-feira')
    expect(formatDeliveryDay('2026-10-19', '2026-10-16', 'en', 'tomorrow')).toBe('Monday')
  })

  it('gives the full date further away (after a closed period)', () => {
    expect(formatDeliveryDay('2027-01-04', '2026-12-23', 'pt', 'amanhã')).toBe('segunda-feira, 4 de janeiro')
    expect(formatDeliveryDay('2027-01-04', '2026-12-23', 'en', 'tomorrow')).toBe('Monday, 4 January')
  })
})

describe('formatTime', () => {
  it('uses the Portuguese "h" and keeps the English colon', () => {
    expect(formatTime('16:30', 'pt')).toBe('16h30')
    expect(formatTime('16:30', 'en')).toBe('16:30')
  })
})

describe('formatDays', () => {
  it('writes a run of days as a range', () => {
    expect(formatDays([1, 2, 3, 4, 5], 'pt')).toBe('seg. a sex.')
    expect(formatDays([5, 4, 3, 2, 1], 'en')).toBe('Mon–Fri')
  })

  it('lists days that are not a run', () => {
    expect(formatDays([1, 3, 5], 'pt')).toBe('seg., qua. e sex.')
    expect(formatDays([2, 4], 'en')).toBe('Tue and Thu')
  })
})

describe('formatAmount and formatKg', () => {
  it('formats numbers per language', () => {
    expect(formatAmount(5200, 'pt')).toBe('52,00')
    expect(formatAmount(399, 'en')).toBe('3.99')
    expect(formatKg(3, 'pt')).toBe('3,0 kg')
    expect(formatKg(0.7, 'en')).toBe('0.7 kg')
  })
})
