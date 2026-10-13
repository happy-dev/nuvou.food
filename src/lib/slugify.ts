/** "Caril de grão-de-bico!" → "caril-de-grao-de-bico": lowercase ASCII words joined by hyphens, for URLs. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents: ã → a, ç → c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
