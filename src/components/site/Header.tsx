import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Link } from '@/i18n/navigation'

import { LanguageSwitch } from './LanguageSwitch'

/** Sticky header on every page: logo, navigation, language, cart. */
export function Header() {
  const t = useTranslations('Nav')

  return (
    <header className="sticky top-0 z-20 border-b border-marrom/10 bg-branco">
      <div className="wrap flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label={t('home')} className="shrink-0">
          <Image src="/brand/nuvou-logo-rosa.jpg" alt="" width={56} height={56} className="size-14 rounded-2xl object-cover" />
        </Link>
        <nav className="flex gap-5 text-sm font-bold uppercase tracking-[0.06em] sm:gap-7">
          <Link href="/menu" className="hover:underline">
            {t('menu')}
          </Link>
          {/* On phones, "About us" is reached from the story section and the footer. */}
          <Link href="/about" className="hidden hover:underline sm:inline">
            {t('about')}
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm font-bold">
          <LanguageSwitch />
          {/* The cart arrives in Phase 5. */}
          <span className="btn btn-primary px-4 py-2.5 text-sm">{t('cart', { count: 0 })}</span>
        </div>
      </div>
    </header>
  )
}
