'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import type { ComponentProps } from 'react'

import { Link, usePathname } from '@/i18n/navigation'

/** Link to the same page in the other language (e.g. /pt/sobre-nos ↔ /en/about). */
export function LanguageSwitch() {
  const t = useTranslations('Nav')
  const other = useLocale() === 'pt' ? 'en' : 'pt'
  // The route pattern (e.g. "/menu/[slug]") and its values, so next-intl can
  // build the translated URL.
  const pathname = usePathname()
  const params = useParams()
  const href = { pathname, params } as ComponentProps<typeof Link>['href']

  return (
    <Link href={href} locale={other} lang={other} aria-label={t('switchLanguageLabel')} className="hover:underline">
      {t('switchLanguage')}
    </Link>
  )
}
