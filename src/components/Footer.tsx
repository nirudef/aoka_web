import Link from 'next/link'
import { getTranslations } from '@/lib/i18n'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'

export default async function Footer({ lang }: { lang: string }) {
  const t = await getTranslations(lang)

  return (
    <footer className="w-full border-t bg-gray-900 border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        {/* О Коллегии */}
        <div>
          <h3 className="font-semibold text-gray-100 mb-2">
            {t.appTitle ?? 'Алматинская областная коллегия адвокатов'}
          </h3>
          <p className="text-gray-400 text-justify">
            {t.footer?.about ??
              'Алматинская областная коллегия адвокатов объединяет профессиональных защитников, оказывающих квалифицированную юридическую помощь гражданам и организациям.'}
          </p>
        </div>

        {/* Для адвоката */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-2">
            {t.footer?.for_lawyer ?? 'Для адвоката'}
          </h4>
          {/* <ul className="space-y-1 text-gray-600 dark:text-gray-400">
            <li>
              <span className="font-medium">{t.contacts?.addressLabel ?? 'Адрес'}:</span>{' '}
              {t.contacts?.address ?? 'г. Конаев, мкр. Ивушка, ул. Степная 8А'}
            </li>
            <li>
              <span className="font-medium">{t.contacts?.phoneLabel ?? 'Телефон'}:</span>{' '}
              <a href="tel:+77272713677" className="hover:text-blue-600">
                +7 (727) 271-36-77
              </a>
            </li>
            <li>
              <span className="font-medium">{t.contacts?.hoursLabel ?? 'Время работы'}:</span>{' '}
              {t.contacts?.hours ?? 'Пн–Пт с 9:00 до 18:00'}
            </li>
          </ul> */}
        </div>

        {/* Навигация */}
        <div>
          <h4 className="font-semibold text-gray-100 mb-2">
            {t.footer?.links ?? 'Ссылки'}
          </h4>
          <nav className="flex flex-col space-y-1 text-gray-400">
            <Link href={`/${lang}`} className="hover:text-white hover:underline">
              {t.nav?.home ?? 'Главная'}
            </Link>
            <Link href={`/${lang}/collegium`} className="hover:text-white hover:underline">
              {t.nav?.collegium ?? 'Коллегия'}
            </Link>
            <Link href={`/${lang}/lawyers`} className="hover:text-white hover:underline">
              {t.nav?.lawyers ?? 'Адвокаты'}
            </Link>
            <Link href={`/${lang}/center`} className="hover:text-white hover:underline">
              {t.nav?.center ?? 'Центр'}
            </Link>
            <Link href={`/${lang}/articles`} className="hover:text-white hover:underline">
              {t.nav?.articles ?? 'Публикации'}
            </Link>
            <Link href={`/${lang}/contacts`} className="hover:text-white hover:underline">
              {t.nav?.contacts ?? 'Контакты'}
            </Link>
          </nav>
        </div>

        {/* Контакты */}
        <div>
          <div>
            <h4 className="font-semibold text-gray-100 mb-2">
              {t.contacts?.title ?? 'Контакты'}
            </h4>
            <ul className="space-y-1 text-gray-400">
              <li>
                <span className="font-medium">{t.contacts?.addressLabel ?? 'Адрес'}:</span>{' '}
                {t.contacts?.address ?? 'г. Конаев, мкр. Ивушка, ул. Степная 8А'}
              </li>
              <li>
                <span className="font-medium">{t.contacts?.phoneLabel ?? 'Телефон'}:</span>{' '}
                <a href="tel:+77272713677" className="hover:text-white hover:underline">
                  +7 (727) 271-36-77
                </a>
              </li>
              <li>
                <span className="font-medium">{t.contacts?.hoursLabel ?? 'Время работы'}:</span>{' '}
                {t.contacts?.hours ?? 'Пн–Пт с 9:00 до 18:00'}
              </li>
            </ul>
          </div>

          {/* Соц сети */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com/aoka.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 text-gray-400"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com/aoka.kz"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-pink-600 text-gray-400"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:aoka_office@list.ru"
              className="hover:text-blue-400 text-gray-400"
            >
              <Mail size={20} />
            </a>
            {/* <a
              href="tel:+77272713677"
              className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
            >
              <Phone size={20} />
            </a> */}
          </div>
        </div>
      </div>

      {/* Нижняя полоса */}
      <div className="border-t dark:border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {t.appTitle ?? 'Алматинская областная коллегия адвокатов'}.{' '}
        {t.footer?.rights ?? 'Все права защищены.'}
      </div>
    </footer>
  )
}
