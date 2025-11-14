// app/[lang]/cabinet/categories/CategoryList.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit3, Trash2, Hash } from 'lucide-react'

interface Category {
  id: string
  key: string
  name: string
  position: number
}

interface Translation {
  cabinet: {
    categories: {
      key: string
      deleteConfirm: string
      deleted: string
    }
  }
}

export function CategoryList({
  categories,
  lang,
  t,
}: {
  categories: Category[]
  lang: string
  t: Translation
}) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, key: string) => {
    if (!confirm(t.cabinet.categories.deleteConfirm)) return
    setDeletingId(id)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert(t.cabinet.categories.deleted)
        router.refresh()
      } else {
        alert('Ошибка при удалении')
      }
    } catch (e) {
      alert('Ошибка сети')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ключ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Название ({lang})</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Позиция</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-4 py-3 font-mono text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Hash className="w-3 h-3 mr-1 text-gray-400" />
                    {c.key}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.position}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <a 
                      href={`/${lang}/cabinet/categories/${c.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(c.id, c.key)}
                      disabled={deletingId === c.id}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                      title="Удалить"
                    >
                      {deletingId === c.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Нет категорий. Нажмите «Новая категория».
        </div>
      )}
    </div>
  )
}
