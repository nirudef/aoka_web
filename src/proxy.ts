import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ru', 'kk', 'en']
const defaultLocale = 'ru'

// Получаем предпочитаемый язык из заголовков
function getLocale(request: NextRequest) {
  const acceptLang = request.headers.get('accept-language') || ''
  for (const locale of locales) {
    if (acceptLang.includes(locale)) return locale
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Игнорируем API, статические ресурсы и системные пути
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return
  }

  // Проверяем, начинается ли путь с допустимого языка
  const pathnameHasLocale = locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  // если уже локализованный путь — не редиректим повторно
  return
}

// Настройка сопоставления (matcher)
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets).*)'],
}
