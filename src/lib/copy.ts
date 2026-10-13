// Marketing texts edited in /admin (the HomePage global…) use a tiny markup,
// so editors don't need a rich-text editor:
// - *words*    → highlighted words (Fraunces light italic in headings)
// - **words**  → bold
// - {name}     → a value from Site settings, e.g. {perPerson} → "4,75 €"
// - blank line → new paragraph
// Figures are never typed in the copy: if a price or time changes in Site
// settings, every text follows.

/** The placeholders editors can use, with the help text shown in the admin. */
export const PLACEHOLDERS = {
  perPerson: 'complete dinner per person (main + rice + salad, size M)',
  deliveryFee: 'delivery fee',
  freeOver: 'free delivery from',
  cutoff: 'same-day cut-off time',
  windowStart: 'delivery window start',
  windowEnd: 'delivery window end',
  days: 'delivery days',
} as const

export type Placeholder = keyof typeof PLACEHOLDERS
export type CopyValues = Record<Placeholder, string>

export type Span = { text: string; style?: 'em' | 'strong' }

const PLACEHOLDER = /\{(\w+)\}/g

const isPlaceholder = (name: string): name is Placeholder => Object.hasOwn(PLACEHOLDERS, name)

/** Placeholders in a text that don't exist (typos), e.g. ["perPersom"]. */
export function unknownPlaceholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map((m) => m[1]).filter((name) => !isPlaceholder(name))
}

/** Replaces {name} with its value. Unknown names are left as they are, so a typo stays visible. */
export function fillPlaceholders(text: string, values: CopyValues): string {
  return text.replace(PLACEHOLDER, (match, name: string) => (isPlaceholder(name) ? values[name] : match))
}

/** Splits a text into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Splits a line into plain, *highlighted* and **bold** spans. */
export function parseInline(text: string): Span[] {
  const spans: Span[] = []
  let last = 0
  for (const m of text.matchAll(/\*\*(.+?)\*\*|\*(.+?)\*/g)) {
    if (m.index > last) spans.push({ text: text.slice(last, m.index) })
    spans.push(m[1] !== undefined ? { text: m[1], style: 'strong' } : { text: m[2], style: 'em' })
    last = m.index + m[0].length
  }
  if (last < text.length) spans.push({ text: text.slice(last) })
  return spans
}
