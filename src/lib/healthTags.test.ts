import { describe, expect, it } from 'vitest'

import { inferHealthTags } from './healthTags'

// Nutrient ids: 1 cálcio, 2 vitamina D, 3 ferro, 4 B12, 5 ómega-3
const tags = [
  { name: 'Ossos fortes', nutrients: [1, 2] },
  { name: 'Sangue saudável', nutrients: [3, 4] },
  { name: 'Coração saudável', nutrients: [{ id: 5 }] }, // as Payload returns it with depth ≥ 1
]

describe('inferHealthTags', () => {
  it('gives a tag when the recipe has at least one of its nutrients', () => {
    expect(inferHealthTags([3], tags).map((t) => t.name)).toEqual(['Sangue saudável'])
  })

  it('gives several tags, in the tags order, without duplicates', () => {
    expect(inferHealthTags([5, 1, 2], tags).map((t) => t.name)).toEqual(['Ossos fortes', 'Coração saudável'])
  })

  it('accepts nutrients as ids or as documents', () => {
    expect(inferHealthTags([{ id: 4 }], tags).map((t) => t.name)).toEqual(['Sangue saudável'])
  })

  it('gives no tag without notable nutrients', () => {
    expect(inferHealthTags(null, tags)).toEqual([])
    expect(inferHealthTags([], tags)).toEqual([])
  })
})
