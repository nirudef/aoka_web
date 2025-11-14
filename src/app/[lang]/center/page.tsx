// import Head from 'next/head'
import CenterClient from './CenterClient'
import { getTranslations } from '@/lib/i18n'
import type { Metadata, ResolvingMetadata } from 'next'

export default async function CenterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  return <CenterClient lang={lang} />
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
    '@type': 'EducationalOrganization',
    name: t.center?.title ?? 'Центр повышения квалификации и стажировки',
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
    title: t.center?.title ?? 'Центр повышения квалификации и стажировки — обучение и развитие адвокатов',
    description: t.center?.description ?? 'Центр повышения квалификации и стажировки Алматинской областной коллегии адвокатов организует обучение, семинары и программы развития для адвокатов и стажёров.',
    alternates: { canonical: `https://aoka.kz/${lang}/center` },
    openGraph: {
      title: t.center?.title,
      description: t.center?.description,
      url: `https://aoka.kz/${lang}/center`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.center?.title,
      description: t.center?.description,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
