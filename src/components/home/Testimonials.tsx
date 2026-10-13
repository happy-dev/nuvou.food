import { CmsImage } from '@/components/site/CmsImage'
import { Inline, Paragraphs } from '@/components/site/Copy'
import type { CopyValues } from '@/lib/copy'
import type { HomePage } from '@/payload-types'

import { Band } from './sections'

/** "What people who've eaten it say": quote, photo (or initial), name and detail. */
export function Testimonials({ content, values }: { content: HomePage['testimonials']; values: CopyValues }) {
  if (!content.items?.length) return null

  return (
    <Band tone="white">
      <div className="wrap">
        <h2>
          <Inline text={content.title} values={values} />
        </h2>
        <ul className="mt-9 grid gap-6 md:grid-cols-3">
          {content.items.map((item, i) => (
            <li key={item.id ?? i}>
              <figure className="flex h-full flex-col rounded-card bg-marrom/5 p-7">
                <blockquote className="flex-1 font-display text-xl leading-snug">
                  <Paragraphs text={`“${item.quote}”`} values={values} />
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {typeof item.photo === 'object' && item.photo ? (
                    <CmsImage media={item.photo} sizes="56px" className="size-14 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="grid size-14 place-items-center rounded-full bg-rosa font-display text-2xl">
                      {item.name.charAt(0)}
                    </span>
                  )}
                  <span>
                    <b className="block">{item.name}</b>
                    {item.detail && <span className="text-sm opacity-75">{item.detail}</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Band>
  )
}
