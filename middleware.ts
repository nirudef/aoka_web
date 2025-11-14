// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('authToken')?.value
  if (!token) return NextResponse.next()

  // 🔸 Проверяем /me ТОЛЬКО для защищённых маршрутов (например, /cabinet)
  const isProtectedRoute = pathname.includes('/cabinet') || pathname.includes('/profile')

  if (isProtectedRoute) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
        headers: { Authorization: `Token ${token}` },
        cache: 'no-store',
      })

      if (!res.ok) {
        const response = NextResponse.redirect(new URL(`/${request.nextUrl.locale}/login`, request.url))
        response.cookies.delete('authToken')
        return response
      }
    } catch (e) {
      // silent fail
    }
  }

  return NextResponse.next()
}
