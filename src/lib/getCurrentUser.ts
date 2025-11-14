// lib/getCurrentUser.ts
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { User } from '@/lib/types'

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')?.value

  if (!token) return null

  const fingerprint = token.substring(0, 16)
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/me?_tk=${fingerprint}`

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
      next: {
        tags: ['user'],
        revalidate: 300,
      },
      cache: 'force-cache',
    })

    if (res.ok) {
      const data = await res.json()

      // если backend возвращает { user: { ... } }
      const userData = data.user || data

      return {
        id: userData.id,
        email: userData.email,
        verified: Boolean(userData.verified),
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        middle_name: userData.middle_name || '',
        iin: userData.iin || '',
        phone: userData.phone || '',
        license_number: userData.license_number || '',
        license_issued_at: userData.license_issued_at || null,
        joined_at: userData.joined_at || null,
        branch_id: userData.branch_id || null,
        law_office_id: userData.law_office_id || null,
        address: userData.address || '',
        roles: userData.roles || [],
      } satisfies User
    }

    if (res.status === 401 || res.status === 403) {
      await clearUserCache()
    }
  } catch (e) {
    console.warn('[getCurrentUser] fetch failed:', e)
  }

  return null
}

export async function clearUserCache() {
  'use server'
  revalidateTag('user', { expire: 0 })
}
