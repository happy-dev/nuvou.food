import { PRODUCT_TYPES, type ProductType } from '@/lib/pricing'

// Admin labels for the product types declared in src/lib/pricing.ts.
// The list of types itself lives there only; this file just names them.
export const PRODUCT_TYPE_LABELS: Record<ProductType, { singular: string; plural: string }> = {
  main: { singular: 'Main dish', plural: 'Main dishes' },
  rice: { singular: 'Rice', plural: 'Rice' },
  salad: { singular: 'Salad', plural: 'Salads' },
}

/** Options for a `select` field: one per product type. */
export const productTypeOptions = PRODUCT_TYPES.map((value) => ({
  label: PRODUCT_TYPE_LABELS[value].singular,
  value,
}))
