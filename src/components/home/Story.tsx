import { useTranslations } from 'next-intl'

import { CmsImage } from '@/components/site/CmsImage'
import { Inline, Paragraphs } from '@/components/site/Copy'
import { Link } from '@/i18n/navigation'
import type { CopyValues } from '@/lib/copy'
import type { HomePage } from '@/payload-types'

import { Band, Eyebrow, Split } from './sections'

/** Story teaser, leading to the About us page. */
export function Story({ content, values }: { content: HomePage['story']; values: CopyValues }) {
  const t = useTranslations('Home')

  return (
    <Band tone="marrom">
      <Split
        mediaFirst
        media={
          <CmsImage
            media={content.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] w-full rounded-img object-cover"
          />
        }
      >
        <Eyebrow label={content.eyebrow} />
        <h2 className="mb-5 mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <Paragraphs text={content.text} values={values} lead />
        <p className="mt-6">
          <Link href="/about" className="link-arrow">
            {t('ourStory')}
          </Link>
        </p>
      </Split>
    </Band>
  )
}
