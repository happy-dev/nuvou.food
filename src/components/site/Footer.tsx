import { useTranslations } from 'next-intl'
import Image from 'next/image'

type Props = { contactEmail: string; instagramUrl?: string | null }

/** Footer on every page. The Instagram link appears once it's set in Site settings. */
export function Footer({ contactEmail, instagramUrl }: Props) {
  const t = useTranslations('Footer')

  return (
    <footer className="bg-marrom pb-10 pt-16 text-rosa">
      <div className="wrap flex flex-wrap items-start justify-between gap-8">
        <div>
          <Image src="/brand/nuvou-logo-rosa.jpg" alt="Nuvou" width={64} height={64} className="size-16 rounded-2xl object-cover" />
          <p className="mt-3 font-display text-3xl">{t('tagline')}</p>
        </div>
        <ul className="grid gap-2 font-semibold">
          <li>
            {t('questions')}{' '}
            <a href={`mailto:${contactEmail}`} className="underline">
              {contactEmail}
            </a>
          </li>
          {instagramUrl && (
            <li>
              <a href={instagramUrl} className="underline" target="_blank" rel="noopener noreferrer">
                {t('instagram')}
              </a>
            </li>
          )}
          <li>© {new Date().getFullYear()} Nuvou</li>
        </ul>
      </div>
    </footer>
  )
}
