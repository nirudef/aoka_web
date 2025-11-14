// app/[lang]/cabinet/articles/ArticleList.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit3, Trash2, Eye, Clock, Globe } from 'lucide-react'

interface Article {
  id: string
  slug: string
  title: string
  lead: string
  published_at: string
  status: 'draft' | 'published' | 'archived'
  category: { key: string; name: string } | null
}

interface Category {
  key: string
  name: string
}

interface Translation {
  cabinet: {
    articles: {
      status: {
        draft: string
        published: string
        archived: string
      }
      deleteConfirm: string
      deleted: string
    }
  }
}

export function ArticleList({
  articles,
  categories,
  lang,
  t,
}: {
  articles: Article[]
  categories: Category[]
  lang: string
  t: Translation
}) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(t.cabinet.articles.deleteConfirm)) return
    setDeletingId(id)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${slug}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert(t.cabinet.articles.deleted)
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

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: t.cabinet.articles?.status?.draft ?? 'draft', color: 'bg-gray-100 text-gray-800' },
    published: { label: t.cabinet.articles?.status?.published ?? 'published', color: 'bg-green-100 text-green-800' },
    archived: { label: t.cabinet.articles?.status?.archived ?? 'archived', color: 'bg-yellow-100 text-yellow-800' },
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Заголовок</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Категория</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Статус</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Дата</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-white">{a.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{a.lead}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {a.category?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[a.status].color}`}>
                    {statusLabels[a.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(a.published_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <a 
                      href={`/${lang}/cabinet/articles/${a.slug}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(a.id, a.slug)}
                      disabled={deletingId === a.id}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                      title="Удалить"
                    >
                      {deletingId === a.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <a 
                      href={`/${lang}/articles/${a.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                      title="Просмотр"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {articles.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Нет публикаций. Нажмите «Новая публикация», чтобы добавить первую.
        </div>
      )}
    </div>
  )
}
