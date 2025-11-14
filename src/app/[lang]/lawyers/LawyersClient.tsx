'use client'

import { useState, useEffect } from 'react'

interface Lawyer {
  id: string
  first_name: string
  last_name: string
  middle_name?: string
  email?: string
  branch?: { translations: Record<string, { name: string }> }
  law_office?: { translations: Record<string, { name: string }> }
  // law_office?: { name: string }
}

interface Meta {
  current_page: number
  total_pages: number
  total_count: number
}

export default function LawyersClient({ lang, t }: { lang: string, t: any }) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [meta, setMeta] = useState<Meta>({ current_page: 1, total_pages: 1, total_count: 0 })
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [lawOfficeFilter, setLawOfficeFilter] = useState('')
  const [branches, setBranches] = useState<any[]>([])
  const [lawOffices, setLawOffices] = useState<any[]>([])

  const fetchLawyers = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      query,
      branch_id: branchFilter,
      law_office_id: lawOfficeFilter,
    })
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/lawyers?${params}`)
    if (!res.ok) return
    const data = await res.json()
    console.log(data)
    setLawyers(data.users)
    setMeta(data.meta)
  }

  useEffect(() => {
    fetchLawyers()
  }, [page, query, branchFilter, lawOfficeFilter])

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices`).then(r => r.json()),
    ]).then(([branches, lawOffices]) => {
      setBranches(branches)
      setLawOffices(lawOffices)
    })
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-6 min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-6">{t.lawyers?.title}</h1>

      {/* Поиск и фильтры */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder={t.lawyers?.searchPlaceholder}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />

        <select
          value={branchFilter}
          onChange={(e) => { setBranchFilter(e.target.value); setPage(1) }}
          className="border rounded px-3 py-2"
        >
          <option value="">{t.lawyers?.allBranches}</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.translations?.[lang]?.name || '—'}
            </option>
          ))}
        </select>

        <select
          value={lawOfficeFilter}
          onChange={(e) => { setLawOfficeFilter(e.target.value); setPage(1) }}
          className="border rounded px-3 py-2"
        >
          <option value="">{t.lawyers?.allLawOffices}</option>
          {lawOffices.map((f) => (
            <option key={f.id} value={f.id}>
              {f.translations?.[lang]?.name || '—'}
            </option>
          ))}
        </select>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 border-b text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-600">{t.lawyers?.fio}</th>
              <th className="px-4 py-2 font-medium text-gray-600">{t.lawyers?.branch}</th>
              <th className="px-4 py-2 font-medium text-gray-600">{t.lawyers?.lawFirm}</th>
            </tr>
          </thead>
          <tbody>
            {lawyers?.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {[u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ')}
                </td>
                <td className="px-4 py-2">{u.branch?.translations?.[lang]?.name || '—'}</td>
                <td className="px-4 py-2">{u.law_office?.translations?.[lang]?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn">« {t.nav?.back}</button>
        <span>{page} / {meta.total_pages}</span>
        <button disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)} className="btn">{t.nav?.next} »</button>
      </div>
    </main>
  )
}
