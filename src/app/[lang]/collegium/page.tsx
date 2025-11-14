// src/app/[lang]/collegium/page.tsx
import CollegiumClient from './CollegiumClient'
import { getTranslations } from '@/lib/i18n'
import type { Metadata, ResolvingMetadata } from 'next'

export default async function CollegiumPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)

  return <CollegiumClient lang={lang} />
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
    title: t.collegium?.title ?? 'Об Алматинской областной коллегии адвокатов',
    description: t.collegium?.description ?? 'Информация о деятельности, органах и документах коллегии.',
    alternates: { canonical: `https://aoka.kz/${lang}/collegium` },
    openGraph: {
      title: t.collegium?.title,
      description: t.collegium?.description,
      url: `https://aoka.kz/${lang}/collegium`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.collegium?.title,
      description: t.collegium?.description,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
