import type { TextareaField, TextField } from 'payload'

import { PLACEHOLDERS, unknownPlaceholders } from '@/lib/copy'

/** Shown once at the top of each page global: the markup the copy fields accept. */
export const COPY_HELP =
  'Text markup: *words* = highlighted (italic in titles), **words** = bold, a blank line = new paragraph. ' +
  'Never type prices or times: use a placeholder and the site fills in the value from Site settings: ' +
  Object.entries(PLACEHOLDERS)
    .map(([name, help]) => `{${name}} ${help}`)
    .join(', ') +
  '.'

type Options = {
  name: string
  label?: string
  /** Several lines and paragraphs (textarea) rather than one line. */
  long?: boolean
  required?: boolean
  description?: string
  width?: string
}

/**
 * A localized marketing text that accepts the copy markup (src/lib/copy.ts).
 * Saving is refused if it contains an unknown {placeholder}, so a typo can't
 * reach the site.
 */
export function copyField({ name, label, long = false, required = true, description, width }: Options): TextField | TextareaField {
  const validate = (value: unknown) => {
    if (typeof value !== 'string' || !value.trim()) return required ? 'This field is required.' : true
    const unknown = unknownPlaceholders(value)
    return unknown.length
      ? `Unknown placeholder: ${unknown.map((n) => `{${n}}`).join(', ')}. Available: ${Object.keys(PLACEHOLDERS)
          .map((n) => `{${n}}`)
          .join(', ')}`
      : true
  }
  const base = { name, label, localized: true, required, validate, admin: { description, width } }
  return long ? { ...base, type: 'textarea' } : { ...base, type: 'text' }
}
