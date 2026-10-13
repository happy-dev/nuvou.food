import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Cheaper } from '@/components/home/Cheaper'
import { FinalCall } from '@/components/home/FinalCall'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { MostOrdered } from '@/components/home/MostOrdered'
import { Faster, Healthy, KidApproved, Planet } from '@/components/home/Promises'
import { Story } from '@/components/home/Story'
import { Testimonials } from '@/components/home/Testimonials'
import { getHealthTags, getHomePage, getRecipes, getSiteSettings } from '@/data/site'
import type { Locale } from '@/lib/format'
import { inferHealthTags } from '@/lib/healthTags'
import { fromPriceInCents, mostOrdered } from '@/lib/menu'
import { toCopyValues, toPricingSettings } from '@/lib/settings'

// Home page. The copy and images come from /admin → Home page; prices, delivery
// times and products from Site settings and Recipes. Pre-rendered, and rebuilt
// when that content changes (src/hooks/revalidateSite.ts).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale
  setRequestLocale(locale)

  const [home, settings, recipes, tags] = await Promise.all([
    getHomePage(locale),
    getSiteSettings(locale),
    getRecipes(locale),
    getHealthTags(locale),
  ])

  if (!home.hero?.headline) {
    const t = await getTranslations('Home')
    return <main className="wrap py-24">{t('notFilledIn')}</main>
  }

  const values = toCopyValues(settings, locale)
  const pricing = toPricingSettings(settings)
  // Until orders exist (Phase 5), "most ordered" means featured first, then the rest.
  const products = mostOrdered(recipes, { limit: 4 })
  // The nutrition visual uses a real recipe: the first shown that has nutrition figures.
  const example = products.find((r) => r.nutrition?.protein != null)

  return (
    <main>
      <Hero content={home.hero} values={values} />
      <HowItWorks content={home.howItWorks} values={values} />
      <Faster content={home.faster} values={values} />
      <Cheaper content={home.cheaper} values={values} pricing={pricing} />
      <KidApproved content={home.kids} values={values} />
      <Healthy
        content={home.healthy}
        values={values}
        example={example && { recipe: example, tags: inferHealthTags(example.notableNutrients, tags) }}
      />
      <Planet content={home.planet} values={values} />
      <MostOrdered
        content={home.mostOrdered}
        values={values}
        products={products.map((recipe) => ({ recipe, fromPrice: fromPriceInCents(recipe, pricing) }))}
      />
      <Story content={home.story} values={values} />
      <Testimonials content={home.testimonials} values={values} />
      <FinalCall content={home.finalCall} values={values} />
    </main>
  )
}
