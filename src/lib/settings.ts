import type { SiteSetting } from '@/payload-types'

import type { CopyValues } from './copy'
import { lisbonDate, type DeliverySettings, type Weekday } from './delivery'
import { formatDays, formatTime, type Locale } from './format'
import { completeDinnerPerPersonInCents, formatPrice, toCents, type PricingSettings } from './pricing'

// Bridges the Site settings document (as stored by Payload) to the plain
// shapes used by the pricing and delivery functions, which stay Payload-free.

type SettingsDoc = Pick<
  SiteSetting,
  | 'portions'
  | 'defaultPrices'
  | 'deliveryFee'
  | 'freeDeliveryThreshold'
  | 'deliveryDays'
  | 'sameDayCutoff'
  | 'closedDates'
  | 'windowStart'
  | 'windowEnd'
>

export function toPricingSettings(doc: SettingsDoc): PricingSettings {
  return {
    defaultPrices: doc.defaultPrices,
    portions: doc.portions,
    deliveryFee: doc.deliveryFee,
    freeDeliveryThreshold: doc.freeDeliveryThreshold,
  }
}

/** Values of the {placeholders} in the marketing copy (see copy.ts), formatted for a language. */
export function toCopyValues(doc: SettingsDoc, locale: Locale): CopyValues {
  const pricing = toPricingSettings(doc)
  return {
    perPerson: formatPrice(completeDinnerPerPersonInCents(pricing), locale),
    deliveryFee: formatPrice(toCents(doc.deliveryFee), locale),
    freeOver: formatPrice(toCents(doc.freeDeliveryThreshold), locale),
    cutoff: formatTime(doc.sameDayCutoff, locale),
    windowStart: formatTime(doc.windowStart, locale),
    windowEnd: formatTime(doc.windowEnd, locale),
    days: formatDays(toDeliverySettings(doc).deliveryDays, locale),
  }
}

export function toDeliverySettings(doc: SettingsDoc): DeliverySettings {
  return {
    deliveryDays: doc.deliveryDays.map((day) => Number(day) as Weekday),
    sameDayCutoff: doc.sameDayCutoff,
    // Payload stores dates as full timestamps; keep only the Lisbon calendar day.
    closedPeriods: (doc.closedDates ?? []).map(({ from, until }) => ({
      from: lisbonDate(new Date(from)),
      until: lisbonDate(new Date(until)),
    })),
  }
}
