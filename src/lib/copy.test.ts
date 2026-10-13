import { describe, expect, it } from 'vitest'

import { fillPlaceholders, paragraphs, parseInline, unknownPlaceholders, type CopyValues } from './copy'

const values: CopyValues = {
  perPerson: '4,75 €',
  deliveryFee: '5 €',
  freeOver: '30 €',
  cutoff: '16h30',
  windowStart: '17h00',
  windowEnd: '20h30',
  days: 'seg. a sex.',
}

describe('fillPlaceholders', () => {
  it('replaces placeholders with their values', () => {
    expect(fillPlaceholders('Custa {perPerson} por pessoa, até às {cutoff}.', values)).toBe(
      'Custa 4,75 € por pessoa, até às 16h30.',
    )
  })

  it('leaves unknown placeholders visible', () => {
    expect(fillPlaceholders('{perPersom}', values)).toBe('{perPersom}')
  })
})

describe('unknownPlaceholders', () => {
  it('lists the typos only', () => {
    expect(unknownPlaceholders('{perPerson} {perPersom} {cutof}')).toEqual(['perPersom', 'cutof'])
    expect(unknownPlaceholders('No placeholder')).toEqual([])
  })
})

describe('paragraphs', () => {
  it('splits on blank lines and trims', () => {
    expect(paragraphs('One.\n\nTwo,\nstill two.\n  \n\nThree. ')).toEqual(['One.', 'Two,\nstill two.', 'Three.'])
  })
})

describe('parseInline', () => {
  it('finds highlighted and bold words', () => {
    expect(parseInline('Comida feita em casa. *Sem a chatice.* Custa **4,75 €**.')).toEqual([
      { text: 'Comida feita em casa. ' },
      { text: 'Sem a chatice.', style: 'em' },
      { text: ' Custa ' },
      { text: '4,75 €', style: 'strong' },
      { text: '.' },
    ])
  })

  it('returns plain text as one span', () => {
    expect(parseInline('Plain')).toEqual([{ text: 'Plain' }])
  })
})
