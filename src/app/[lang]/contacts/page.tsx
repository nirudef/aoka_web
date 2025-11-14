// src/app/[lang]/contacts/page.tsx
import { getTranslations } from '@/lib/i18n';
// import type { Metadata } from 'next';
import ContactsMap from './ContactsMap';
import ContactForm from './ContactForm';
import MiniMap from './MiniMap';
import type { Metadata, ResolvingMetadata } from 'next'

const SUPPORTED = ['ru', 'kk', 'en'] as const;
type Locale = (typeof SUPPORTED)[number];

interface Params {
  params: Promise<{ lang: string }>;
}

// export async function generateMetadata({ params }: Params): Promise<Metadata> {
//   const { lang } = await params;
//   const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : 'ru';
//   const t = await getTranslations(locale);

//   return {
//     title: t.contacts?.title ?? 'Контакты',
//     description: t.contacts?.description ?? 'Контактная информация Коллегии адвокатов',
//   };
// }

export default async function ContactsPage({ params }: Params) {
  const { lang } = await params;
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : 'ru';
  const t = await getTranslations(locale);

  const branches = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${locale}`,
    { next: { revalidate: 3600 } }
  ).then(res => res.json());

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Заголовок */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t.contacts?.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          {t.contacts?.description}
        </p>
      </div>

      {/* Главные действия — F-приоритет */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a
          href="tel:+77272713677"
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md transition"
          aria-label="Позвонить в коллегию адвокатов"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 11-2 0v-.667L17.194 16a1.03 1.03 0 00-.93.53l-2.07 4.284A1 1 0 0113.21 21H4a1 1 0 01-1-1v-4a1 1 0 01.836-.986l4.435-.74a1 1 0 011.06.54l.773 1.548a11.037 11.037 0 006.105-6.105l-1.548-.774a1 1 0 01-.54-1.059l.74-4.435A1 1 0 018 3H3a1 1 0 01-1-1z"/>
          </svg>
          <span className="text-lg">Позвонить</span>
        </a>
        <a
          href="mailto:aoka_office@list.ru"
          className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition"
          aria-label="Написать на email коллегии"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <span className="text-lg">Email</span>
        </a>
      </div>

      {/* Основной блок: офис + форма */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Информация об офисе */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🏢 {t.contacts?.officeTitle || 'Головной офис'}</h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t.contacts?.addressLabel}</h3>
              <p className="mt-1 text-gray-900">{t.contacts?.address}</p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-medium text-gray-500">{t.contacts?.hoursLabel}</h3>
              <p className="mt-1 text-gray-900">{t.contacts?.hours}</p>
            </div>
          </div>

          {/* Мини-карта */}
          <div className="mt-6">
            <MiniMap />
          </div>
        </div>

        {/* Форма */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📨 {t.contacts?.formTitle || 'Обратная связь'}</h2>
          <ContactForm lang={locale} />
        </div>
      </div>

      {/* Филиалы */}
      <section id="branches" className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          🏢 {t.contacts?.branchesTitle || 'Филиалы'}
        </h2>
        <ContactsMap branches={branches} lang={locale} />
      </section>
    </main>
  );
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
    title: t.contacts?.title ?? 'Контакты Алматинская областная коллегия адвокатов',
    description: t.contacts?.description ?? 'Контакты Алматинская областная коллегия адвокатов и ее филиалов',
    alternates: { canonical: `https://aoka.kz/${lang}/contacts` },
    openGraph: {
      title: t.contacts?.title,
      description: t.contacts?.description,
      url: `https://aoka.kz/${lang}/contacts`,
      siteName: t.appTitle,
      images: [{ url: '/logo.png', width: 512, height: 512, alt: t.appTitle }, ...previousOGImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.contacts?.title,
      description: t.contacts?.description,
      images: ['/logo.png'],
    },
    // JSON-LD встроится автоматически в <head>
    other: {
      'application/ld+json': JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
    },
  }
}
