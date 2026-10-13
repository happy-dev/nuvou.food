import { useLocale, useTranslations } from 'next-intl'

import { CmsImage } from '@/components/site/CmsImage'
import { Inline, Paragraphs } from '@/components/site/Copy'
import type { CopyValues } from '@/lib/copy'
import { formatKg, type Locale } from '@/lib/format'
import type { HealthTag, HomePage, Nutrient, Recipe } from '@/payload-types'

import { Band, Eyebrow, Split } from './sections'

// Promises 1, 3, 4 and 5 (2, "Cheaper", is in Cheaper.tsx). The order and
// numbering follow the positioning in CLAUDE.md.

const splitImage = 'aspect-[4/3.4] w-full rounded-img object-cover'
const imageSizes = '(min-width: 768px) 50vw, 100vw'

export function Faster({ content, values }: { content: HomePage['faster']; values: CopyValues }) {
  return (
    <Band tone="rosa">
      <Split media={<CmsImage media={content.image} sizes={imageSizes} className={splitImage} />}>
        <Eyebrow number={1} label={content.eyebrow} />
        <h2 className="mb-5 mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <Paragraphs text={content.text} values={values} lead />
      </Split>
    </Band>
  )
}

export function KidApproved({ content, values }: { content: HomePage['kids']; values: CopyValues }) {
  return (
    <Band tone="rosa">
      <Split media={<CmsImage media={content.image} sizes={imageSizes} className={splitImage} />}>
        <Eyebrow number={3} label={content.eyebrow} />
        <h2 className="mb-5 mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <Paragraphs text={content.text} values={values} lead />
        <p className="mt-7 inline-grid size-[150px] -rotate-12 place-items-center rounded-full border-4 border-current p-4 text-center font-display text-2xl leading-none">
          <Inline text={content.stamp} values={values} />
        </p>
      </Split>
    </Band>
  )
}

type HealthyProps = {
  content: HomePage['healthy']
  values: CopyValues
  /** A real recipe whose nutrition bar and tags illustrate the promise (none: no visual). */
  example?: { recipe: Recipe; tags: HealthTag[] }
}

export function Healthy({ content, values, example }: HealthyProps) {
  return (
    <Band tone="white">
      <div className="wrap">
        <Eyebrow number={4} label={content.eyebrow} />
        <h2 className="mt-3">
          <Inline text={content.title} values={values} />
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-card bg-marrom/5 p-7 md:p-9">
            <h3 className="mb-3">
              <Inline text={content.wholeFoodTitle} values={values} />
            </h3>
            <Paragraphs text={content.wholeFoodText} values={values} />
          </div>
          <div className="rounded-card bg-marrom/5 p-7 md:p-9">
            <h3 className="mb-3">
              <Inline text={content.balancedTitle} values={values} />
            </h3>
            <Paragraphs text={content.balancedText} values={values} />
            {example && <NutritionExample {...example} />}
          </div>
        </div>
      </div>
    </Band>
  )
}

/** The share-of-energy bar and health tags of one recipe, as shown on product pages. */
function NutritionExample({ recipe, tags }: { recipe: Recipe; tags: HealthTag[] }) {
  const t = useTranslations('Home.macros')
  const n = recipe.nutrition ?? {}
  const macros = [
    { key: 'protein', value: n.protein ?? 0, colour: 'bg-laranja' },
    { key: 'carbs', value: n.carbs ?? 0, colour: 'bg-rosa' },
    { key: 'fat', value: n.fat ?? 0, colour: 'bg-marrom' },
  ] as const
  const total = macros.reduce((sum, m) => sum + m.value, 0) || 1
  const recipeNutrients = new Set((recipe.notableNutrients ?? []).map((n) => (typeof n === 'object' ? n.id : n)))

  return (
    <figure className="mt-5">
      <div className="flex h-4 overflow-hidden rounded-full" role="img" aria-label={t('label')}>
        {macros.map((m) => (
          <div key={m.key} className={m.colour} style={{ width: `${(m.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-4 text-[13px]">
        {macros.map((m) => (
          <li key={m.key} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full ${m.colour}`} />
            {t(m.key)} {m.value}%
          </li>
        ))}
      </ul>
      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            // The tag's nutrients this recipe actually has, e.g. "Ossos fortes · cálcio"
            const names = (tag.nutrients ?? [])
              .filter((n): n is Nutrient => typeof n === 'object' && recipeNutrients.has(n.id))
              .map((n) => n.name.toLowerCase())
            return (
              <li key={tag.id} className="rounded-full bg-laranja px-3 py-1.5 text-[13px] font-bold text-branco">
                {tag.icon} {tag.name}
                {names.length > 0 && <span className="font-normal opacity-85"> · {names.join(', ')}</span>}
              </li>
            )
          })}
        </ul>
      )}
      <figcaption className="mt-3 text-[13px] opacity-70">{t('example', { name: recipe.name })}</figcaption>
    </figure>
  )
}

export function Planet({ content, values }: { content: HomePage['planet']; values: CopyValues }) {
  const t = useTranslations('Home.carbon')
  const locale = useLocale() as Locale
  const bars = [
    { label: t('average'), kg: content.averageKg, colour: 'bg-marrom' },
    { label: t('ours'), kg: content.oursKg, colour: 'bg-laranja' },
  ]
  const max = Math.max(...bars.map((b) => b.kg)) || 1

  return (
    <Band tone="rosa" className="py-14">
      <div className="wrap grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow number={5} label={content.eyebrow} />
          <Paragraphs text={content.text} values={values} className="mt-2.5 font-display text-[1.625rem] leading-tight" />
        </div>
        <div>
          <ul className="grid gap-3">
            {bars.map((bar) => (
              <li key={bar.label} className="grid grid-cols-[110px_1fr_56px] items-center gap-3 text-sm md:grid-cols-[150px_1fr_60px]">
                <span>{bar.label}</span>
                <span className={`h-[22px] rounded-full ${bar.colour}`} style={{ width: `${(bar.kg / max) * 100}%` }} />
                <b>{formatKg(bar.kg, locale)}</b>
              </li>
            ))}
          </ul>
          <Paragraphs text={content.footnote} values={values} className="mt-3.5 text-xs opacity-75" />
        </div>
      </div>
    </Band>
  )
}
