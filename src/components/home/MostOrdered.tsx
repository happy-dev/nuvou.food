import { useTranslations } from 'next-intl'

import { Inline } from '@/components/site/Copy'
import { ProductCard } from '@/components/site/ProductCard'
import { Link } from '@/i18n/navigation'
import type { CopyValues } from '@/lib/copy'
import type { HomePage, Recipe } from '@/payload-types'

import { Band } from './sections'

type Props = {
  content: HomePage['mostOrdered']
  values: CopyValues
  /** Already picked and ordered (src/lib/menu.ts → mostOrdered), with their "from" price. */
  products: { recipe: Recipe; fromPrice: number | null }[]
}

export function MostOrdered({ content, values, products }: Props) {
  const t = useTranslations('Home')
  if (products.length === 0) return null

  return (
    <Band tone="white">
      <div className="wrap">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <h2>
            <Inline text={content.title} values={values} />
          </h2>
          <Link href="/menu" className="link-arrow">
            {t('seeFullMenu')}
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 min-[480px]:grid-cols-2 min-[900px]:grid-cols-4">
          {products.map(({ recipe, fromPrice }) => (
            <ProductCard key={recipe.id} recipe={recipe} fromPrice={fromPrice} />
          ))}
        </div>
      </div>
    </Band>
  )
}
