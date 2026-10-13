// Health tags are inferred, not ticked: a recipe shows a tag when at least one
// of its notable nutrients is among the tag's nutrients. Pure function.

type Ref = number | { id: number }
const idOf = (ref: Ref): number => (typeof ref === 'object' ? ref.id : ref)

export type TagWithNutrients<T> = T & { nutrients?: Ref[] | null }

/** The tags a recipe earns from its notable nutrients, in the tags' original order. */
export function inferHealthTags<T>(notableNutrients: Ref[] | null | undefined, tags: TagWithNutrients<T>[]): TagWithNutrients<T>[] {
  const present = new Set((notableNutrients ?? []).map(idOf))
  return tags.filter((tag) => (tag.nutrients ?? []).some((nutrient) => present.has(idOf(nutrient))))
}
