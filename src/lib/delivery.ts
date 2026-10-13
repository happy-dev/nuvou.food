// Delivery slot: when will an order placed now arrive? Pure functions, no
// database access. All times are Lisbon local time, whatever the server's
// timezone (the hosting server may run in UTC).

export const TIMEZONE = 'Europe/Lisbon'

/** ISO weekday numbers: 1 = Monday … 7 = Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type DeliverySettings = {
  /** Days we deliver on, e.g. [1, 2, 3, 4, 5] for Monday–Friday. */
  deliveryDays: Weekday[]
  /** Same-day cut-off, "HH:MM" (Lisbon time). Orders at or after it go to the next delivery day. */
  sameDayCutoff: string
  /** Periods with no delivery (public holidays, holidays away), "YYYY-MM-DD", both ends included. */
  closedPeriods?: { from: string; until: string }[]
}

export type DeliverySlot = {
  /** Delivery date, "YYYY-MM-DD" (Lisbon). */
  date: string
  weekday: Weekday
  isToday: boolean
}

type LocalParts = { date: string; minutes: number }

/** Lisbon calendar date ("YYYY-MM-DD") of an instant. */
export const lisbonDate = (instant: Date): string => lisbonParts(instant).date

/** Lisbon calendar date and minutes since midnight for an instant. */
function lisbonParts(instant: Date): LocalParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Weekday of a "YYYY-MM-DD" calendar date. */
function weekdayOf(date: string): Weekday {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay() // 0 = Sunday
  return (day === 0 ? 7 : day) as Weekday
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Is this date a delivery day: one of the delivery weekdays, and not in a closed period? */
function isDeliveryDate(date: string, settings: DeliverySettings): boolean {
  if (!settings.deliveryDays.includes(weekdayOf(date))) return false
  // "YYYY-MM-DD" strings compare correctly as text.
  return !settings.closedPeriods?.some(({ from, until }) => from <= date && date <= until)
}

/** Safety net: never search more than a year ahead (e.g. if every day is closed by mistake). */
const MAX_DAYS_AHEAD = 366

/**
 * The delivery slot for an order placed at `now`: today if it's a delivery day
 * and before the cut-off, otherwise the next delivery day (skipping closed periods).
 */
export function deliverySlotFor(now: Date, settings: DeliverySettings): DeliverySlot {
  if (settings.deliveryDays.length === 0) throw new Error('No delivery days configured')

  const { date: today, minutes } = lisbonParts(now)
  const beforeCutoff = minutes < toMinutes(settings.sameDayCutoff)

  let date = today
  if (!(isDeliveryDate(today, settings) && beforeCutoff)) {
    let daysAhead = 0
    do {
      date = addDays(date, 1)
      if (++daysAhead > MAX_DAYS_AHEAD) throw new Error('No delivery date in the next year: check closed dates')
    } while (!isDeliveryDate(date, settings))
  }

  return { date, weekday: weekdayOf(date), isToday: date === today }
}
