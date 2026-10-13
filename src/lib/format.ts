import type { Weekday } from './delivery'

// Display formats shared by the site, per language. Prices: see formatPrice in
// pricing.ts.

export type Locale = 'pt' | 'en'

const NUMBER_LOCALE: Record<Locale, string> = { pt: 'pt-PT', en: 'en-IE' }

/** "16:30" → "16h30" in Portuguese, "16:30" in English. */
export function formatTime(hhmm: string, locale: Locale): string {
  return locale === 'pt' ? hhmm.replace(':', 'h') : hhmm
}

// Short day names, as written in the copy ("seg. a sex.", "Mon–Fri"). Intl's
// Portuguese short names ("segunda") don't match the usual abbreviations.
const SHORT_DAYS: Record<Locale, string[]> = {
  pt: ['seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.', 'dom.'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

/** Delivery days: a run of days becomes "seg. a sex." / "Mon–Fri", others a list. */
export function formatDays(days: Weekday[], locale: Locale): string {
  const sorted = [...new Set(days)].sort((a, b) => a - b)
  const names = sorted.map((d) => SHORT_DAYS[locale][d - 1])
  const isRun = sorted.length > 2 && sorted.every((d, i) => i === 0 || d === sorted[i - 1] + 1)
  if (isRun) return locale === 'pt' ? `${names[0]} a ${names.at(-1)}` : `${names[0]}–${names.at(-1)}`
  return new Intl.ListFormat(NUMBER_LOCALE[locale], { type: 'conjunction' }).format(names)
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * The delivery day, relative to today (both "YYYY-MM-DD", Lisbon): `tomorrow`
 * (the translated word) for tomorrow, the weekday within a week ("segunda-feira"),
 * and the full date beyond (after a closed period: "segunda-feira, 5 de janeiro").
 */
export function formatDeliveryDay(date: string, today: string, locale: Locale, tomorrow: string): string {
  const daysAway = Math.round((Date.parse(date) - Date.parse(today)) / DAY_MS)
  if (daysAway === 1) return tomorrow
  return new Intl.DateTimeFormat(NUMBER_LOCALE[locale], {
    weekday: 'long',
    ...(daysAway > 6 && { day: 'numeric', month: 'long' }),
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

/** An amount without the currency sign, for receipts: "52,00" / "52.00". */
export function formatAmount(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    cents / 100,
  )
}

/** "3,0 kg" / "3.0 kg". */
export function formatKg(kg: number, locale: Locale): string {
  return `${new Intl.NumberFormat(NUMBER_LOCALE[locale], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(kg)} kg`
}
