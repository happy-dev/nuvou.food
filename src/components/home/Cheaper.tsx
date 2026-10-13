import { useLocale, useTranslations } from 'next-intl'

import { Inline, Paragraphs } from '@/components/site/Copy'
import type { CopyValues } from '@/lib/copy'
import { formatAmount, type Locale } from '@/lib/format'
import { completeDinnerPerPersonInCents, formatPrice, priceInCents, toCents, type PricingSettings } from '@/lib/pricing'
import type { HomePage } from '@/payload-types'

import { Band, Eyebrow, Split } from './sections'

type Props = { content: HomePage['cheaper']; values: CopyValues; pricing: PricingSettings }

/**
 * Promise 2: two receipts side by side. The takeaway one comes from the admin;
 * the Nuvou one is computed from the default M prices, so it always matches the shop.
 */
export function Cheaper({ content, values, pricing }: Props) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const people = pricing.portions.medium

  const takeaway = (content.takeaway ?? []).map((line) => ({ label: line.item, cents: toCents(line.amount) }))
  const takeawayTotal = takeaway.reduce((sum, line) => sum + line.cents, 0)
  // Rounded to the euro: "≈ 19 €"
  const takeawayPerPerson = `≈ ${formatPrice(Math.round(takeawayTotal / people / 100) * 100, locale)}`

  const nuvou = (['main', 'rice', 'salad'] as const).map((type) => ({
    label: `${t(`Product.types.${type}`)} ${t('Product.sizesShort.medium')}`,
    cents: priceInCents({ type }, 'medium', pricing),
  }))

  return (
    <Band tone="marrom">
      <Split
        mediaFirst
        media={
          <div className="flex flex-wrap justify-center gap-5 py-4 md:flex-nowrap md:items-start">
            {takeaway.length > 0 && (
              <Receipt
                title={t('Home.receipts.takeaway')}
                lines={takeaway}
                people={people}
                total={takeawayPerPerson}
                className="-rotate-[4deg] [&_[data-total]]:line-through [&_[data-total]]:decoration-laranja [&_[data-total]]:decoration-[3px]"
              />
            )}
            <Receipt
              title={t('Home.receipts.nuvou')}
              lines={nuvou}
              people={people}
              total={formatPrice(completeDinnerPerPersonInCents(pricing), locale)}
              className="rotate-3 [&_[data-total]]:text-laranja"
            />
          </div>
        }
      >
        <Eyebrow number={2} label={content.eyebrow} />
        <h2 className="mb-5 mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <Paragraphs text={content.text} values={values} lead />
      </Split>
    </Band>
  )
}

type ReceiptProps = {
  title: string
  lines: { label: string; cents: number }[]
  people: number
  total: string
  className?: string
}

function Receipt({ title, lines, people, total, className = '' }: ReceiptProps) {
  const t = useTranslations('Home.receipts')
  const locale = useLocale() as Locale
  const row = 'flex justify-between gap-3 border-b border-dashed border-neutral-400 py-1.5'

  return (
    <div
      className={`relative w-full max-w-[260px] bg-white px-5 pb-8 pt-6 font-mono text-sm md:w-[45%] md:px-4 md:text-[13px] text-neutral-800 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)] after:absolute after:inset-x-0 after:-bottom-2.5 after:h-3 after:bg-[radial-gradient(circle_at_6px_-2px,transparent_7px,#fff_7.5px)] after:bg-[length:12px_12px] after:bg-repeat-x after:content-[''] ${className}`}
    >
      <p className="mb-3.5 text-center font-bold tracking-[0.1em]">{title}</p>
      {lines.map((line) => (
        <p key={line.label} className={row}>
          <span>{line.label}</span>
          <span>{formatAmount(line.cents, locale)}</span>
        </p>
      ))}
      <p className={row}>{t('dividedBy', { count: people })}</p>
      <p className="mt-3 flex justify-between text-lg font-bold">
        <span>{t('perPerson')}</span>
        <span data-total>{total}</span>
      </p>
    </div>
  )
}
