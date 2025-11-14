'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DeleteUserButton from './DeleteUserButton'

interface User {
  id: string
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  roles: string[]
  branch?: { translations: Record<string, { name: string }> }
}

interface Meta {
  current_page: number
  total_pages: number
  total_count: number
}

interface Props {
  initialUsers: User[]
  initialMeta: Meta
  lang: string
  t: any
}

const roleLabels: Record<string, string> = {
  lawyer: 'Адвокат',
  accountant: 'Бухгалтер',
  branch_head: 'Заведующий филиалом',
  admin: 'Администратор',
}

export default function UsersTable({ initialUsers, initialMeta, lang }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [meta, setMeta] = useState<Meta>(initialMeta)
  const [page, setPage] = useState(meta.current_page)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      query,
      role: roleFilter,
    })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${params}`)
    if (!res.ok) return
    const data = await res.json()
    console.log(data)
    setUsers(data.users)
    setMeta(data.meta)
  }

  useEffect(() => {
    fetchUsers()
  }, [page, query, roleFilter])

  return (
    <div className="">
      {/* Поиск и фильтры */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Поиск по ФИО, email, ИИН"
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1) }}
          className="input"
        />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }} className="input">
          <option value="">Все роли</option>
          {Object.entries(roleLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 border-b text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-600">ФИО</th>
              <th className="px-4 py-2 font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 font-medium text-gray-600">Филиал</th>
              <th className="px-4 py-2 font-medium text-gray-600">Роли</th>
              <th className="px-4 py-2 text-right font-medium text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{[u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ')}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.branch?.translations?.[lang]?.name || '—'}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200">
                        {roleLabels[r] ?? r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <Link href={`/${lang}/cabinet/users/${u.id}/edit`} className="text-blue-600 hover:underline">
                    Редактировать
                  </Link>
                  <DeleteUserButton userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn">« Назад</button>
        <span>{page} / {meta.total_pages}</span>
        <button disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)} className="btn">Вперед »</button>
      </div>
    </div>
  )
}
