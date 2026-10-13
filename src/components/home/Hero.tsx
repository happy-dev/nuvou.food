import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { CmsImage } from '@/components/site/CmsImage'
import { Inline } from '@/components/site/Copy'
import { Link } from '@/i18n/navigation'
import type { CopyValues } from '@/lib/copy'
import type { HomePage } from '@/payload-types'

// Scalloped sticker outline (14 bumps around a circle), echoing the logo's shape.
const SCALLOP = (() => {
  const bumps = 14, c = 100, r = 86, bulge = 20
  const point = (angle: number, radius: number) =>
    `${(c + radius * Math.cos(angle)).toFixed(1)},${(c + radius * Math.sin(angle)).toFixed(1)}`
  let d = `M${point(0, r)}`
  for (let i = 1; i <= bumps; i++) {
    d += ` Q${point(((i - 0.5) / bumps) * 2 * Math.PI, r + bulge)} ${point((i / bumps) * 2 * Math.PI, r)}`
  }
  return `${d}Z`
})()

type Props = { content: HomePage['hero']; values: CopyValues }

/** Food photo with the brand block (marrom, big rosa logo) and the rotating price sticker. */
export function Hero({ content, values }: Props) {
  const t = useTranslations('Home')
  const hasImage = typeof content.image === 'object' && content.image !== null

  // Phones: a shorter photo, with the brand block overlapping it so the headline
  // shows without scrolling. Wide screens: the photo fills the hero, and the block
  // and sticker sit in the same 1200px column as the header.
  return (
    <div className="relative">
      <CmsImage
        media={content.image}
        sizes="100vw"
        preload
        className="h-[66vh] w-full object-cover md:absolute md:inset-0 md:h-full"
      />

      <div className="wrap flex flex-col md:relative md:min-h-[min(86vh,760px)] md:justify-end md:py-10">
        {/* Decorative: the same price is in the copy and the final call. Positioned
            against the photo on phones, against the column on wide screens. */}
        <div
          aria-hidden
          className="absolute right-4 top-6 grid size-[130px] place-items-center text-center text-branco motion-safe:animate-[spin_26s_linear_infinite] md:right-[8%] md:top-[12%] md:size-[180px]"
        >
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full fill-laranja">
            <path d={SCALLOP} />
          </svg>
          <span className="relative font-display text-[26px] leading-[0.95] motion-safe:animate-[spin_26s_linear_infinite_reverse] md:text-[34px]">
            {values.perPerson}
            <small className="block font-sans text-[13px] font-bold tracking-wide">{t('perPerson')}</small>
          </span>
        </div>

        <div
          className={`relative rounded-card bg-marrom p-6 text-rosa sm:p-10 md:mt-0 md:max-w-[620px] ${hasImage ? 'mt-[-44vh]' : 'mt-4'}`}
        >
          <Image
            src="/brand/nuvou-logo-rosa.jpg"
            alt="Nuvou: Boa vida na comida"
            width={200}
            height={200}
            className="-mb-2 -ml-3 -mt-2 size-[110px] rounded-card object-cover md:-ml-6 md:-mt-5 md:size-[200px]"
          />
          <h1 className="mb-4 mt-3">
            <Inline text={content.headline} values={values} />
          </h1>
          <p className="lead">
            <Inline text={content.subtitle} values={values} />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-primary">
              {t('seeMenu')}
            </Link>
            <a href="#how-it-works" className="btn btn-ghost">
              {t('howItWorks')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
