import Image from 'next/image'

import type { Media } from '@/payload-types'

type Props = {
  /** An upload field's value: the Media document (depth ≥ 1), or just its id when not loaded. */
  media: number | Media | null | undefined
  /** Which width the image takes on screen, so Next.js serves the right size, e.g. "(min-width: 768px) 50vw, 100vw". */
  sizes: string
  className?: string
  /** For the first big image of a page: loads it first. */
  preload?: boolean
}

/** An image uploaded in /admin, resized by Next.js for each screen. Its alt text comes from the Media document. */
export function CmsImage({ media, sizes, className, preload }: Props) {
  if (!media || typeof media === 'number' || !media.url) return null
  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      sizes={sizes}
      className={className}
      preload={preload}
    />
  )
}
