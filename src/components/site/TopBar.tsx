'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'

import { deliverySlotFor, lisbonDate, type DeliverySettings } from '@/lib/delivery'
import { formatDays, formatDeliveryDay, formatTime, type Locale } from '@/lib/format'

// The page is pre-rendered, so it can't know the visitor's time: the server
// version says "same-day delivery". In the browser, the bar then says whether
// an order placed now arrives today, tomorrow or on a later day, and updates
// itself when the cut-off passes.

const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 30_000)
  return () => clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / 60_000)
const noTimeOnServer = () => null

type Props = { delivery: DeliverySettings; windowStart: string; windowEnd: string }

export function TopBar({ delivery, windowStart, windowEnd }: Props) {
  const t = useTranslations('TopBar')
  const locale = useLocale() as Locale
  const minute = useSyncExternalStore(subscribe, currentMinute, noTimeOnServer)

  const params = {
    cutoff: formatTime(delivery.sameDayCutoff, locale),
    start: formatTime(windowStart, locale),
    end: formatTime(windowEnd, locale),
    days: formatDays(delivery.deliveryDays, locale),
  }

  let text = t('sameDay', params)
  if (minute !== null) {
    const now = new Date(minute * 60_000)
    const slot = deliverySlotFor(now, delivery)
    text = slot.isToday
      ? t('today', params)
      : t('later', { ...params, day: formatDeliveryDay(slot.date, lisbonDate(now), locale, t('tomorrow')) })
  }

  return <p className="bg-laranja px-4 py-2 text-center text-sm font-semibold text-branco">{text}</p>
}
