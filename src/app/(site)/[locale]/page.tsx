import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { use } from 'react'

import { Link } from '@/i18n/navigation'

// Temporary page for PR 1 (foundation): checks fonts, colours, languages and logo.
// The real Home page arrives in PR 3.
export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations('Home')
  const nav = useTranslations('Nav')
  const otherLocale = locale === 'pt' ? 'en' : 'pt'

  return (
    <main className="min-h-dvh bg-rosa p-4 sm:p-8">
      <div className="mx-auto max-w-2xl rounded-card bg-marrom p-8 text-rosa sm:p-10">
        <Image
          src="/brand/nuvou-logo-rosa.jpg"
          alt="Nuvou: Boa vida na comida"
          width={200}
          height={200}
          priority
          className="-ml-6 -mt-5 mb-2 size-36 rounded-card object-cover sm:size-48"
        />
        <h1 className="text-5xl leading-[0.92] sm:text-7xl">
          {t.rich('headline', { em: (chunks) => <em>{chunks}</em> })}
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-snug">{t('subtitle')}</p>
        <p className="mt-8 inline-block rounded-full bg-laranja px-6 py-3 font-bold text-branco">
          {t('comingSoon')}
        </p>
        <p className="mt-8 text-sm">
          <Link href="/" locale={otherLocale} className="font-bold underline">
            {nav('switchLanguage')}
          </Link>
        </p>
      </div>
    </main>
  )
}
