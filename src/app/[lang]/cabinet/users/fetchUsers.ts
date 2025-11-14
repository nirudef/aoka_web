// app/[lang]/cabinet/users/fetchUsers.ts
export async function fetchUsers({
  page = 1,
  query = '',
  role = '',
  lang = 'ru',
}: {
  page?: number
  query?: string
  role?: string
  lang?: string
}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`)
  url.searchParams.set('page', page.toString())
  if (query) url.searchParams.set('query', query)
  if (role) url.searchParams.set('role', role)
  if (lang) url.searchParams.set('lang', lang)

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json() as Promise<{ users: any[]; meta: any }>
}
