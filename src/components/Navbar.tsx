'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { User, LogIn, Menu, X, Globe } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import Image from 'next/image'

export default function Navbar({ lang, t, user }: { lang: string, t: any, user: any }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isActive = (href: string) => pathname === href

  const changeLang = (newLang: string) => {
    const segments = pathname.split('/')
    segments[1] = newLang
    router.push(segments.join('/'))
    setLangMenuOpen(false)
  }

  return (
    <nav className="bg-background text-foreground border-b border-gray-200 dark:border-gray-800 top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Логотип и название */}
          <div className="flex items-center space-x-3">
            <Link href={`/${lang}`}>
              <Image
                src="/logo.png"
                alt={t.appTitle}
                width={48}
                height={48}
                className="rounded-md"
              />
            </Link>
            <div className="leading-tight max-w-[230px]">
              <Link
                href={`/${lang}`}
                className="text-sm sm:text-base font-semibold hover:text-blue-600 transition-colors"
              >
                {t.appTitle}
              </Link>
            </div>
          </div>

          {/* Навигация */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href={`/${lang}/collegium`}
              className={`hover:text-blue-600 transition-colors ${
                isActive(`/${lang}/collegium`) ? 'active-link' : ''
              }`}
            >
              {t.nav?.collegium}
            </Link>
            <Link
              href={`/${lang}/lawyers`}
              className={`hover:text-blue-600 transition-colors ${
                isActive(`/${lang}/lawyers`) ? 'active-link' : ''
              }`}
            >
              {t.nav?.lawyers}
            </Link>
            <Link
              href={`/${lang}/center`}
              className={`hover:text-blue-600 transition-colors ${
                isActive(`/${lang}/center`) ? 'active-link' : ''
              }`}
            >
              {t.nav?.center}
            </Link>
            <Link
              href={`/${lang}/contacts`}
              className={`hover:text-blue-600 transition-colors ${
                isActive(`/${lang}/contacts`) ? 'active-link' : ''
              }`}
            >
              {t.nav?.contacts}
            </Link>

            {/* Переключатель языка */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1 text-sm hover:text-blue-600"
              >
                <Globe size={18} />
                <span>{lang.toUpperCase()}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-background text-foreground border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  {['ru', 'kk', 'en'].map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLang(l)}
                      className={`block w-full text-left px-3 py-1 text-sm ${
                        lang === l
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-400'
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Переключатель темы */}
            <ThemeToggle />

            {/* Авторизация */}
            {user ? (
              <Link
                href={`/${lang}/cabinet`}
                className="px-2 py-1 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center"
              >
                <User size={20} className='mr-2' />
                <span className="hidden sm:inline">{t.cabinet?.title}</span>
              </Link>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="px-3 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition flex items-center"
              >
                <LogIn size={20} className='mr-2' />
                <span className="hidden sm:inline">{t.nav.login}</span>
              </Link>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-foreground hover:text-blue-600 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное выпадающее меню */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-gray-200 dark:border-gray-800">
          <Link
            href={`/${lang}`}
            className={`hover:text-blue-600 transition-colors block px-4 py-2 ${
                isActive(`/${lang}`) ? 'active-link' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.home}
          </Link>
          <Link
            href={`/${lang}/collegium`}
            className={`hover:text-blue-600 transition-colors block px-4 py-2 ${
                isActive(`/${lang}/collegium`) ? 'active-link' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.collegium}
          </Link>
          <Link
            href={`/${lang}/lawyers`}
            className={`hover:text-blue-600 transition-colors block px-4 py-2 ${
                isActive(`/${lang}/lawyers`) ? 'active-link' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.lawyers}
          </Link>
          <Link
            href={`/${lang}/center`}
            className={`hover:text-blue-600 transition-colors block px-4 py-2 ${
                isActive(`/${lang}/center`) ? 'active-link' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.center}
          </Link>
          <Link
            href={`/${lang}/contacts`}
            className={`hover:text-blue-600 transition-colors block px-4 py-2 ${
                isActive(`/${lang}/contacts`) ? 'active-link' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.contacts}
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-800">
            {['ru', 'kk', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`block w-full text-left px-4 py-2 ${
                  lang === l
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800">
            {user ? (
              <Link
                href={`/${lang}/profile`}
                className="block px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                <span>{t.nav.profile}</span>
              </Link>
            ) : (
              <Link
                href={`/${lang}/login`}
                className="block px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>{t.nav.login}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
