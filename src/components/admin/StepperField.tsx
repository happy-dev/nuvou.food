'use client'

import { FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { NumberFieldClientComponent } from 'payload'

import './StepperField.css'

// Admin input for quantities: big − / + buttons around the number, easy to tap
// on a phone. The number can still be typed (e.g. 400 g). The buttons move by
// the field's `admin.step` (1 by default, 0.5 for ingredient quantities).
// Registered on number fields with `admin.components.Field`.
export const StepperField: NumberFieldClientComponent = ({ field, path, readOnly }) => {
  const { value, setValue, showError } = useField<number | null>({ path })
  const min = field.min ?? 0
  const step = typeof field.admin?.step === 'number' ? field.admin.step : 1
  const current = typeof value === 'number' ? value : 0
  // Round to 2 decimals so repeated 0.5 steps never drift (0.1 + 0.2 issues).
  const set = (next: number) => setValue(Math.max(min, Math.round(next * 100) / 100))
  const label = typeof field.label === 'string' ? field.label : field.name

  return (
    <div className={`field-type number stepper-field${showError ? ' error' : ''}`}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className="stepper-field__controls">
        <button
          type="button"
          className="stepper-field__button"
          onClick={() => set(current - step)}
          disabled={readOnly || current <= min}
          aria-label={`${label}: one less`}
        >
          −
        </button>
        <input
          className="stepper-field__input"
          type="number"
          inputMode="numeric"
          min={min}
          step="any"
          value={current}
          readOnly={readOnly}
          onFocus={(e) => e.target.select()}
          onChange={(e) => set(e.target.value === '' ? min : Number(e.target.value))}
          aria-label={label}
        />
        <button
          type="button"
          className="stepper-field__button"
          onClick={() => set(current + step)}
          disabled={readOnly}
          aria-label={`${label}: one more`}
        >
          +
        </button>
      </div>
      <FieldError path={path} showError={showError} />
    </div>
  )
}
