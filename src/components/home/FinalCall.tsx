import { useTranslations } from 'next-intl'

import { Inline, Paragraphs } from '@/components/site/Copy'
import { Link } from '@/i18n/navigation'
import type { CopyValues } from '@/lib/copy'
import type { HomePage } from '@/payload-types'

import { Band } from './sections'

/** Delivery facts (computed from Site settings), the "we deliver anywhere" promise, and the last button. */
export function FinalCall({ content, values }: { content: HomePage['finalCall']; values: CopyValues }) {
  const t = useTranslations('Home')
  const facts = [
    t('delivery.fromPerPerson', { price: values.perPerson }),
    t('delivery.sameDay'),
    t('delivery.schedule', { days: values.days, start: values.windowStart, end: values.windowEnd }),
    t('delivery.freeOver', { threshold: values.freeOver, fee: values.deliveryFee }),
  ].map((fact) => fact.charAt(0).toUpperCase() + fact.slice(1)) // "seg. a sex." starts a line here

  return (
    <Band tone="rosa">
      <div className="wrap text-center">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-semibold">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <Paragraphs text={content.smallPrint} values={values} className="mx-auto mt-4 max-w-[60ch] text-sm opacity-85" />
        <h2 className="mb-7 mt-14">
          <Inline text={content.title} values={values} />
        </h2>
        <Link href="/menu" className="btn btn-primary">
          {t('seeMenu')}
        </Link>
      </div>
    </Band>
  )
}
