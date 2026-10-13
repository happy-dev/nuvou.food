import { useTranslations } from 'next-intl'

import { Inline, Paragraphs } from '@/components/site/Copy'
import type { CopyValues } from '@/lib/copy'
import type { HomePage } from '@/payload-types'

type Props = { content: HomePage['howItWorks']; values: CopyValues }

export function HowItWorks({ content, values }: Props) {
  const t = useTranslations('Home')

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 md:py-22">
      <div className="wrap">
        <p className="eyebrow">{t('howItWorks')}</p>
        <h2 className="mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {content.steps?.map((step, i) => (
            <li key={step.id ?? i}>
              <p className="font-display text-7xl leading-none text-laranja">{i + 1}</p>
              <h3 className="mb-2 mt-2.5">
                <Inline text={step.title} values={values} />
              </h3>
              <Paragraphs text={step.text} values={values} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
