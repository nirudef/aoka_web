import { getTranslations } from '@/lib/i18n'
import Link from 'next/link'
import type { Metadata, ResolvingMetadata } from 'next'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)
  // const articles = await fetchArticles(lang)

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{t.appTitle}</h1>
        <p className="text-lg text-gray-600 mb-8">{t.home.subtitle}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/${lang}/about`}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {t.home.learnMore}
          </Link>
          <Link
            href={`/${lang}/login`}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
          >
            {t.home.joinNow}
          </Link>
        </div>
      </section>
    </main>
  )
}

// Динамическая генерация метаданных + JSON-LD
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations(lang)

  const previousOGImages = (await parent)?.openGraph?.images || []

  // JSON-LD микроразметка
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.appTitle ?? 'Алматинская областная коллегия адвокатов',
    url: 'https://aoka.kz',
    logo: 'https://aoka.kz/logo.png',
    sameAs: ['https://facebook.com/aoka.kz', 'https://instagram.com/aoka.kz'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7 727 271 3677',
      contactType: 'customer service',
      areaServed: 'KZ',
      availableLanguage: ['ru', 'kk', 'en'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: t.contacts?.streetAddress ?? 'мкр. Ивушка, ул. Степная 8А',
      addressLocality: t.contacts?.city ?? 'Конаев',
      addressCountry: 'KZ',
    },
  }

  return {
    title: t.appTitle ?? 'Алматинская областная коллегия адвокатов',
    description: t.appDescription ?? 'Официальный сайт Алматинской областной коллегии адвокатов. Новости, контакты, адвокаты и обучение.',
    alternates: { canonical: `https://aoka.kz/${lang}` },
    openGraph: {
      title: t.appTitle,
      description: t.appDescription,
      url: `https://aoka.kz/${lang}`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.appTitle,
      description: t.appDescription,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
