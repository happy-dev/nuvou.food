import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/format'
import { formatPrice } from '@/lib/pricing'
import type { Recipe } from '@/payload-types'

import { CmsImage } from './CmsImage'

type Props = {
  recipe: Recipe
  /** The "from" price in cents (cheapest size in stock), or null when out of stock. */
  fromPrice: number | null
}

/** A product in a grid (Home "Most ordered", Menu): photo, type, name, description, price. No frame. */
export function ProductCard({ recipe, fromPrice }: Props) {
  const t = useTranslations('Product')
  const locale = useLocale() as Locale

  return (
    <Link href={{ pathname: '/menu/[slug]', params: { slug: recipe.slug } }} className="group block">
      <div className="relative">
        <CmsImage
          media={recipe.photos?.[0]}
          sizes="(min-width: 900px) 280px, (min-width: 480px) 50vw, 100vw"
          className="aspect-square w-full rounded-img object-cover"
        />
        {recipe.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-laranja px-3 py-1 text-xs font-bold uppercase tracking-wide text-branco">
            {t('featured')}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.06em] opacity-70">{t(`types.${recipe.type}`)}</p>
      <h3 className="mt-1 font-sans text-lg font-bold group-hover:underline">{recipe.name}</h3>
      {recipe.description && <p className="mt-1 line-clamp-2 text-[15px] opacity-85">{recipe.description}</p>}
      {fromPrice !== null && <p className="mt-3 text-sm font-bold">{t('from', { price: formatPrice(fromPrice, locale) })}</p>}
    </Link>
  )
}
