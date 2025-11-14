import { getTranslations } from '@/lib/i18n'
import LawyersClient from './LawyersClient'
import type { Metadata, ResolvingMetadata } from 'next'

export default async function LawyersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)
  return <LawyersClient lang={lang} t={t} />
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
    name: t.appTitle,
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
    title: t.lawyers?.metaTitle ?? 'Об Алматинской областной коллегии адвокатов',
    description: t.lawyers?.metaDescription ?? 'Информация о деятельности, органах и документах коллегии.',
    alternates: { canonical: `https://aoka.kz/${lang}/lawyers` },
    openGraph: {
      title: t.lawyers?.metaTitle,
      description: t.lawyers?.metaDescription,
      url: `https://aoka.kz/${lang}/lawyers`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.lawyers?.metaTitle,
      description: t.lawyers?.metaDescription,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
