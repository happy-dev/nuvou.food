import type { SiteSetting } from '@/payload-types'

import { lisbonDate, type DeliverySettings, type Weekday } from './delivery'
import type { PricingSettings } from './pricing'

// Bridges the Site settings document (as stored by Payload) to the plain
// shapes used by the pricing and delivery functions, which stay Payload-free.

type SettingsDoc = Pick<
  SiteSetting,
  'portions' | 'defaultPrices' | 'deliveryFee' | 'freeDeliveryThreshold' | 'deliveryDays' | 'sameDayCutoff' | 'closedDates'
>

export function toPricingSettings(doc: SettingsDoc): PricingSettings {
  return {
    defaultPrices: doc.defaultPrices,
    portions: doc.portions,
    deliveryFee: doc.deliveryFee,
    freeDeliveryThreshold: doc.freeDeliveryThreshold,
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
