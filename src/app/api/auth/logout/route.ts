// import { NextResponse } from 'next/server';

// export async function POST() {
//   // опционально — вызвать Rails для удаления сессии
//   // Но в простейшем варианте просто удалить cookie:
//   const cookieValue = `authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure; Domain=.aoka.kz`;
//   return new NextResponse(null, {
//     status: 204,
//     headers: { 'Set-Cookie': cookieValue }
//   });
// }

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { clearUserCache } from '@/lib/getCurrentUser'

export async function POST() {
  await clearUserCache() // ← сбрасывает кэш Next.js
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value

  if (token) {
    try {
      // Получаем ID сессии из токена (бек его знает через signed_id)
      // поэтому просто отправляем токен в Authorization
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/current`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (e) {
      console.error('Ошибка при удалении сессии:', e)
    }
  }

  // Удаляем cookie на фронте
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'https://aoka.kz'))
  res.cookies.set('authToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })

  return res
}

