import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { PRODUCT_TYPE_LABELS } from '@/fields/productTypes'
import { sizeNumberFields } from '@/fields/sizes'
import { PRODUCT_TYPES } from '@/lib/pricing'

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/
const validateTime = (value: unknown) =>
  typeof value === 'string' && HHMM.test(value) ? true : 'Use the HH:MM format, e.g. 16:30'

// Shop-wide settings, edited in /admin → "Site settings". The site reads them
// to compute prices, delivery fees and delivery slots (see src/lib).
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sizes & prices',
          fields: [
            sizeNumberFields({
              name: 'portions',
              label: 'Adult portions per size',
              description: 'Approximate number of adult portions. Used to show the price per portion and per person.',
              required: true,
            }),
            {
              name: 'defaultPrices',
              type: 'group',
              label: 'Default prices (VAT included)',
              admin: { description: 'Used for every recipe of that type, unless the recipe sets its own price.' },
              // One S/M/L price row per product type declared in src/lib/pricing.ts.
              fields: PRODUCT_TYPES.map((type) =>
                sizeNumberFields({ name: type, label: PRODUCT_TYPE_LABELS[type].plural, euros: true, required: true }),
              ),
            },
          ],
        },
        {
          label: 'Delivery',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'deliveryFee', type: 'number', label: 'Delivery fee (€)', min: 0, required: true, admin: { step: 0.01, width: '50%' } },
                {
                  name: 'freeDeliveryThreshold',
                  type: 'number',
                  label: 'Free delivery from (€ of products)',
                  min: 0,
                  required: true,
                  admin: { step: 0.01, width: '50%' },
                },
              ],
            },
            {
              name: 'deliveryDays',
              type: 'select',
              hasMany: true,
              required: true,
              options: [
                { label: 'Monday', value: '1' },
                { label: 'Tuesday', value: '2' },
                { label: 'Wednesday', value: '3' },
                { label: 'Thursday', value: '4' },
                { label: 'Friday', value: '5' },
                { label: 'Saturday', value: '6' },
                { label: 'Sunday', value: '7' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'windowStart', type: 'text', label: 'Delivery window from', required: true, validate: validateTime, admin: { width: '33%' } },
                { name: 'windowEnd', type: 'text', label: 'Delivery window until', required: true, validate: validateTime, admin: { width: '33%' } },
                {
                  name: 'sameDayCutoff',
                  type: 'text',
                  label: 'Same-day cut-off',
                  required: true,
                  validate: validateTime,
                  admin: { width: '33%', description: 'Orders before this time (Lisbon) are delivered the same day.' },
                },
              ],
            },
            {
              name: 'closedDates',
              type: 'array',
              label: 'Closed dates',
              labels: { singular: 'Closed period', plural: 'Closed periods' },
              admin: {
                description:
                  'No delivery on these days (public holidays, holidays away). For a single day, use the same date twice. Orders placed meanwhile are scheduled for the next open delivery day.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'from', type: 'date', required: true, admin: { width: '30%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
                    {
                      name: 'until',
                      type: 'date',
                      required: true,
                      admin: { width: '30%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
                      validate: (value: unknown, { siblingData }: { siblingData: { from?: string } }) =>
                        !value || !siblingData?.from || new Date(value as string) >= new Date(siblingData.from)
                          ? true
                          : '"Until" must be on or after "From"',
                    },
                    { name: 'reason', type: 'text', admin: { width: '40%', description: 'e.g. "Natal", "Férias"' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Storage & reheating',
          description: 'Default text shown on product pages, per type. A recipe can replace it with its own text.',
          fields: [
            { name: 'storageMain', type: 'textarea', label: 'Main dishes', localized: true, required: true },
            { name: 'storageRice', type: 'textarea', label: 'Rice', localized: true, required: true },
            { name: 'storageSalad', type: 'textarea', label: 'Salads', localized: true, required: true },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'contactEmail', type: 'email', required: true },
            {
              name: 'instagramUrl',
              type: 'text',
              label: 'Instagram link',
              admin: { description: 'Optional. The footer shows the Instagram link only once this is filled in.' },
            },
          ],
        },
      ],
    },
  ],
}
