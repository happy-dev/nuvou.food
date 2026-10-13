'use client'

import { useConfig, useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import { useEffect, useState } from 'react'

import './IngredientUnit.css'

type Unit = { name: string; abbreviation?: string | null }

// Read-only "Unit" next to an ingredient's quantity in a recipe: the unit
// comes from the chosen ingredient (Ingredients collection), so it can't be
// mixed up. Registered as a `ui` field in the recipe's ingredients rows.
export const IngredientUnit: UIFieldClientComponent = ({ path }) => {
  // This UI field sits next to the row's `ingredient` field.
  const ingredientPath = path.replace(/[^.]+$/, 'ingredient')
  const ingredient = useFormFields(([fields]) => fields[ingredientPath]?.value) as
    | number
    | { id: number }
    | null
    | undefined
  const ingredientId = typeof ingredient === 'object' && ingredient ? ingredient.id : ingredient
  const { config } = useConfig()
  const [unit, setUnit] = useState<Unit | null>(null)

  useEffect(() => {
    if (!ingredientId) return
    let cancelled = false
    fetch(`${config.serverURL}${config.routes.api}/ingredients/${ingredientId}?depth=1`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!cancelled) setUnit(doc && typeof doc.unit === 'object' ? doc.unit : null)
      })
      .catch(() => !cancelled && setUnit(null))
    return () => {
      cancelled = true
    }
  }, [ingredientId, config.serverURL, config.routes.api])

  const text = !ingredientId ? '—' : unit ? unit.abbreviation || unit.name : '…'
  return (
    <div className="field-type ingredient-unit">
      <span className="ingredient-unit__label">Unit</span>
      <div className="ingredient-unit__value" aria-live="polite">
        {text}
      </div>
    </div>
  )
}
