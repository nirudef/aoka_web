import { getTranslations } from '@/lib/i18n'
import type { Metadata, ResolvingMetadata } from 'next'
import LoginForm from './LoginForm'

// export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
//   const { lang } = await params
//   const t = await getTranslations(lang)
//   return {
//     title: t.login.title || 'Вход',
//     description: t.login.description || 'Страница входа в систему',
//   }
// }

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          {t.login?.formTitle ?? 'Форма авторизации'}
        </h1>
        <LoginForm lang={lang} t={t} />
      </div>
    </div>
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
    title: t.login?.title ?? 'Вход на сайт Алматинской областной коллегии адвокатов',
    description: t.login?.description ?? 'Информация о деятельности, органах и документах коллегии.',
    alternates: { canonical: `https://aoka.kz/${lang}/login` },
    openGraph: {
      title: t.login?.title,
      description: t.lawyers?.metaDescription,
      url: `https://aoka.kz/${lang}/login`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.login?.title,
      description: t.login?.description,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
