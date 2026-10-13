import { describe, expect, it } from 'vitest'

import { slugify } from './slugify'

describe('slugify', () => {
  it('strips Portuguese accents and punctuation', () => {
    expect(slugify('Caril de grão-de-bico!')).toBe('caril-de-grao-de-bico')
    expect(slugify('Feijão branco estufado')).toBe('feijao-branco-estufado')
    expect(slugify('  Açorda   à moda  ')).toBe('acorda-a-moda')
  })
})
