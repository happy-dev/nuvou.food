import type { FieldAccess, GroupField, NumberField } from 'payload'

import { SIZES } from '@/lib/pricing'

const SIZE_LABELS = { small: 'S · 180 mL', medium: 'M · 750 mL', large: 'L · 1200 mL' } as const

/**
 * A row of three number fields, one per portion size (small, medium, large).
 * Used for prices, stock and stock-log quantities, so the admin always shows
 * S / M / L side by side.
 */
export function sizeNumberFields({
  name,
  label,
  description,
  euros = false,
  defaultValue,
  required = false,
  readOnly = false,
  access,
  stepper = false,
}: {
  name: string
  label: string
  description?: string
  /** Prices: show 2 decimals and a € suffix in the label. */
  euros?: boolean
  defaultValue?: number
  required?: boolean
  /** Shown but not editable in the admin. */
  readOnly?: boolean
  /** Field-level access, enforced by the server (not just the admin UI). */
  access?: { create?: FieldAccess; read?: FieldAccess; update?: FieldAccess }
  /**
   * Big − / + buttons (src/components/admin/StepperField.tsx), one size per line
   * so it stays comfortable on a phone. For whole quantities, not prices.
   */
  stepper?: boolean
}): GroupField {
  const sizeFields: NumberField[] = SIZES.map((size) => ({
    name: size,
    type: 'number',
    label: euros ? `${SIZE_LABELS[size]} (€)` : SIZE_LABELS[size],
    min: 0,
    required,
    defaultValue,
    admin: stepper
      ? { readOnly, components: { Field: '/components/admin/StepperField#StepperField' } }
      : { step: euros ? 0.01 : 1, width: '33%', readOnly },
  }))

  return {
    name,
    type: 'group',
    label,
    access,
    admin: { description },
    // Steppers stack vertically; plain number inputs sit side by side in a row.
    fields: stepper ? sizeFields : [{ type: 'row', fields: sizeFields }],
  }
}
