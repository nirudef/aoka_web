// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import '../globals.css'
// import { getTranslations } from '@/lib/i18n'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'

// const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode
//   params: Promise<{ lang: string }>
// }) {
//   const { lang } = await params
//   const t = await getTranslations(lang)
//   const user = null // TODO: получать пользователя через API

//   // Структурированные данные для поисковиков (schema.org)
//   const organizationSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'Organization',
//     name: t.appTitle,
//     url: 'https://aoka.kz',
//     logo: 'https://aoka.kz/logo.png',
//     sameAs: [
//       'https://facebook.com/aoka.kz',
//       'https://instagram.com/aoka.kz',
//     ],
//     contactPoint: {
//       '@type': 'ContactPoint',
//       telephone: '+7 727 271 3677',
//       contactType: 'customer service',
//       areaServed: 'KZ',
//       availableLanguage: ['ru', 'kk', 'en'],
//     },
//     address: {
//       '@type': 'PostalAddress',
//       streetAddress: t.contacts?.streetAddress ?? 'мкр. Ивушка, ул. Степная 8А',
//       addressLocality: t.contacts?.city ?? 'Конаев',
//       addressCountry: 'KZ',
//     },
//   }

//   return (
//     <html lang={lang}>
//       <head>
//         {/* JSON-LD микроразметка */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
//         />
//       </head>
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         <Navbar lang={lang} user={user} t={t} />
//         {children}
//         <Footer lang={lang} />
//       </body>
//     </html>
//   )
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ lang: string }>
// }): Promise<Metadata> {
//   const { lang } = await params
//   const t = await getTranslations(lang)

//   const title =
//     t.appTitle ?? 'Алматинская областная коллегия адвокатов'
//   const description =
//     t.appDescription ??
//     'Алматинская областная коллегия адвокатов — объединение адвокатов Алматы и Алматинской области. Юридическая помощь, консультации, защита прав граждан и организаций. Информация о деятельности и контакты коллегии.'

//   return {
//     title,
//     description,
//     metadataBase: new URL('https://aoka.kz'),
//     icons: {
//       icon: '/favicon.ico',
//       shortcut: '/favicon.ico',
//       apple: '/logo.png',
//     },
//     openGraph: {
//       title,
//       description,
//       type: 'website',
//       url: `https://aoka.kz/${lang}`,
//       siteName: title,
//       images: [
//         {
//           url: '/logo.png',
//           width: 512,
//           height: 512,
//           alt: title,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: ['/logo.png'],
//     },
//   }
// }

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { headers } from 'next/headers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://aoka.kz'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params || 'ru'
  const t = await getTranslations(lang)
  // const requestHeaders = headers()
  // const pathname = (await requestHeaders).get('x-invoke-pathname') || (await requestHeaders).get('next-url')?.split('?')[0] || '/'
  // (await headers()).set('x-url', `/${lang}${pathname || ''}`)
  const user = await getCurrentUser()

  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar lang={lang} t={t} user={user} />
        {children}
        <Footer lang={lang} />
      </body>
    </html>
  )
}
