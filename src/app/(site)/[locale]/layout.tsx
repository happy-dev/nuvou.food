import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DM_Sans, Fraunces } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { routing } from '@/i18n/routing'

import '../globals.css'

// next/font downloads the fonts at build time and serves them from our own
// domain: no request to Google from the visitor's browser (better for privacy
// and speed).
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Pre-render one version of each page per language.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Lets pages in this layout be statically rendered for this language.
  setRequestLocale(locale)

  return (
    <html lang={locale === 'pt' ? 'pt-PT' : 'en'} className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
