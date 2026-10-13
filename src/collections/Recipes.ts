import { slugField, type CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { productTypeOptions } from '@/fields/productTypes'
import { sizeNumberFields } from '@/fields/sizes'
import { slugify } from '@/lib/slugify'

const isMain = (data: { type?: string } | undefined) => data?.type === 'main'

// Every product on the menu: main dishes, rice and salads (one collection, a
// `type` field). Prices fall back to the defaults in Site settings.
export const Recipes: CollectionConfig = {
  slug: 'recipes',
  labels: { singular: 'Recipe', plural: 'Recipes' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'featured', 'stock', 'updatedAt'],
    group: 'Menu',
  },
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', localized: true, required: true, admin: { width: '60%' } },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: productTypeOptions,
          admin: { width: '40%', description: 'Groups the menu and sets the default prices and storage text.' },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              admin: { description: '2 sentences: what it is, in appetising words, then one nutrition point.' },
            },
            {
              name: 'photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'The first photo is the main one. Use a real photo of the dish.' },
            },
            {
              name: 'servingSuggestion',
              type: 'text',
              localized: true,
              admin: {
                condition: isMain,
                description: 'e.g. "Serve com o nosso arroz e uma salada fresca." or "Já é completo: junta só uma salada."',
              },
            },
            {
              name: 'suggestRice',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: isMain,
                description: '"Complete your meal" suggests a rice. Untick for dishes that bring their own starch (potatoes, pies).',
              },
            },
            {
              name: 'storageOverride',
              type: 'textarea',
              localized: true,
              label: 'Storage & reheating (override)',
              admin: { description: 'Leave empty to use the default text for this type (Site settings).' },
            },
          ],
        },
        {
          label: 'Prices & stock',
          fields: [
            sizeNumberFields({
              name: 'priceOverrides',
              label: 'Prices for this recipe',
              description: 'Leave empty to use the default price for this type (Site settings).',
              euros: true,
            }),
            sizeNumberFields({
              name: 'stock',
              label: 'Containers in stock',
              description:
                'Read-only: computed from the Stock log (Menu → Stock log). Add an entry there to pack a batch or record a loss. 0 = that size shows as sold out.',
              defaultValue: 0,
              required: true,
              readOnly: true,
              // Only the stock log may change stock. Without this server-side lock,
              // saving an open recipe form could overwrite a newer stock figure.
              access: { update: ({ req }) => Boolean(req.context?.fromStockMovement) },
            }),
          ],
        },
        {
          label: 'Nutrition',
          fields: [
            {
              name: 'ingredients',
              type: 'array',
              labels: { singular: 'Ingredient', plural: 'Ingredients' },
              admin: {
                description:
                  'Per batch, as you cook them. Type to search; "+" creates a new ingredient. The unit comes from the ingredient.',
              },
              fields: [
                {
                  name: 'ingredient',
                  type: 'relationship',
                  relationTo: 'ingredients',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'quantity',
                      type: 'number',
                      min: 0,
                      required: true,
                      admin: { width: '65%', components: { Field: '/components/admin/StepperField#StepperField' } },
                    },
                    {
                      name: 'unitDisplay',
                      type: 'ui', // display only, nothing stored: the unit lives on the ingredient
                      admin: { width: '35%', components: { Field: '/components/admin/IngredientUnit#IngredientUnit' } },
                    },
                  ],
                },
              ],
            },
            {
              name: 'notableNutrients',
              type: 'relationship',
              relationTo: 'nutrients',
              hasMany: true,
              admin: {
                description:
                  'Nutrients this recipe is a good source of. Shown on the site, and they decide the "Good for" health tags automatically.',
              },
            },
            {
              name: 'nutrition',
              type: 'group',
              label: 'Share of energy (%)',
              fields: [
                {
                  type: 'row',
                  fields: (['protein', 'carbs', 'fat', 'fibre'] as const).map((name) => ({
                    name,
                    type: 'number' as const,
                    min: 0,
                    max: 100,
                    admin: { width: '25%' },
                  })),
                },
              ],
            },
          ],
        },
        {
          label: 'Internal',
          fields: [
            {
              name: 'chefNotes',
              type: 'array',
              label: 'Notes for the chef',
              labels: { singular: 'Note', plural: 'Notes' },
              // Internal: hidden from the public API, admins only.
              access: { read: ({ req }) => Boolean(req.user) },
              admin: {
                description: 'One note per batch, to improve the recipe bit by bit. Never shown on the site.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      defaultValue: () => new Date().toISOString(),
                      admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                    },
                    {
                      name: 'author',
                      type: 'relationship',
                      relationTo: 'users',
                      admin: {
                        width: '50%',
                        readOnly: true,
                        // Hidden on a new note (it's set on save); shown on saved notes.
                        condition: (_data, siblingData) => Boolean(siblingData?.author),
                      },
                      hooks: {
                        // A new note gets the logged-in admin as author; existing notes keep theirs.
                        beforeChange: [({ value, req }) => value ?? req.user?.id],
                      },
                    },
                  ],
                },
                { name: 'note', type: 'textarea', required: true },
              ],
            },
            {
              name: 'sourceLinks',
              type: 'array',
              // Field-level access: hidden from the public API, admins only.
              access: { read: ({ req }) => Boolean(req.user) },
              admin: { description: 'Recipe references (never shown on the site, admins only).' },
              fields: [{ name: 'url', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shown first in "Most ordered" and "Complete your meal".' },
    },
    slugField({ useAsSlug: 'name', slugify: ({ valueToSlugify }) => slugify(String(valueToSlugify ?? '')), position: 'sidebar' }),
  ],
}
