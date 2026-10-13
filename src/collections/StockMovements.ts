import { APIError, type CollectionConfig, type PayloadRequest } from 'payload'

import { isAdmin } from '@/access'
import { sizeNumberFields } from '@/fields/sizes'
import { SIZES } from '@/lib/pricing'
import { applyMovement, directionFor, STOCK_REASONS, StockError, type SizeQuantities, type StockReason } from '@/lib/stock'
import type { StockMovement } from '@/payload-types'

const REASON_LABELS: Record<StockReason, string> = {
  'own-use': 'Own use (−)',
  'direct-sale': 'Direct sale, outside the site (−)',
  production: 'Production: batch packed (+)',
  loss: 'Loss: expired or damaged (−)',
  correction: 'Correction (+ or −)',
}

// The stock log: every change to a recipe's stock is an entry here (a batch
// packed, a loss, a correction; later, paid orders). Recipe stock is the sum of
// these entries, kept up to date by the hooks below.
//
// Entries are never edited: to fix a mistake, delete the entry (which reverses
// its effect on the stock) and create a correct one, like an accounting ledger.

const recipeIdOf = (movement: Pick<StockMovement, 'recipe'>): number =>
  typeof movement.recipe === 'object' ? movement.recipe.id : movement.recipe

/** Apply (or reverse) a movement on its recipe's stock, inside the same transaction. */
async function updateRecipeStock(req: PayloadRequest, movement: StockMovement, reverse: boolean) {
  const recipe = await req.payload.findByID({ collection: 'recipes', id: recipeIdOf(movement), depth: 0, req })
  let stock
  try {
    const direction = directionFor(movement.reason, movement.direction)
    stock = applyMovement(recipe.stock as SizeQuantities, { direction, quantities: movement.quantities }, { reverse })
  } catch (error) {
    // Shown to the admin as a readable message. Throwing here rolls back the
    // whole operation (the entry isn't saved or deleted), thanks to `req`.
    if (error instanceof StockError) throw new APIError(error.message, 400, undefined, true)
    throw error
  }
  await req.payload.update({
    collection: 'recipes',
    id: recipe.id,
    data: { stock },
    req,
    // Lets the update through the field-level lock on Recipes.stock.
    context: { fromStockMovement: true },
  })
}

export const StockMovements: CollectionConfig = {
  slug: 'stock-movements',
  labels: { singular: 'Stock entry', plural: 'Stock log' },
  admin: {
    group: 'Menu',
    defaultColumns: ['createdAt', 'recipe', 'reason', 'direction', 'quantities', 'note'],
    description: 'Every change to stock: batches packed, losses, corrections. To fix a mistake, delete the entry and add a correct one.',
  },
  access: { read: isAdmin, create: isAdmin, update: () => false, delete: isAdmin },
  defaultSort: '-createdAt',
  fields: [
    { name: 'recipe', type: 'relationship', relationTo: 'recipes', required: true },
    {
      name: 'reason',
      type: 'select',
      required: true,
      // The most common entry: portions taken for our own use.
      defaultValue: 'own-use',
      options: (Object.keys(STOCK_REASONS) as StockReason[]).map((value) => ({ label: REASON_LABELS[value], value })),
    },
    {
      name: 'direction',
      type: 'select',
      options: [
        { label: 'Add to stock', value: 'add' },
        { label: 'Remove from stock', value: 'remove' },
      ],
      // Only asked for a correction; for other reasons the hook below sets it.
      admin: { condition: (data) => data?.reason === 'correction' },
    },
    sizeNumberFields({ name: 'quantities', label: 'Containers per size', defaultValue: 0, required: true, stepper: true }),
    {
      name: 'note',
      type: 'text',
      admin: {
        description: 'Optional, e.g. "short of large containers".',
        components: { Cell: '/components/admin/PlainTextCell#PlainTextCell' }, // blank instead of "<No Note>"
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const quantities = data.quantities as SizeQuantities | undefined
        if (!quantities || SIZES.every((size) => !quantities[size])) {
          throw new APIError('Enter at least one quantity.', 400, undefined, true)
        }
        // The reason sets the direction (own use → remove, production → add…);
        // only a correction uses the direction chosen in the form.
        try {
          data.direction = directionFor(data.reason as StockReason, data.direction)
        } catch (error) {
          if (error instanceof StockError) throw new APIError(error.message, 400, undefined, true)
          throw error
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') await updateRecipeStock(req, doc, false)
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // The seed sets this when it wipes sample recipes together with their log.
        if (!req.context?.skipStockUpdate) await updateRecipeStock(req, doc, true)
        return doc
      },
    ],
  },
}
