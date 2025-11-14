// app/[lang]/articles/ArticleList.tsx
'use client'

import Link from 'next/link'
import { Calendar, Tag } from 'lucide-react'

interface Article {
  id: string
  slug: string
  title: string
  lead: string
  published_at: string
  category: { key: string; name: string } | null
}

interface Category {
  key: string
  name: string
}

interface Translation {
  articles: {
    publishedOn: string
    category: string
    readMore: string
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((a) => (
        <div 
          key={a.id} 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <div className="p-5">
            {a.category && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 mb-3">
                <Tag className="w-3 h-3 mr-1" />
                {a.category.name}
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              <Link 
                href={`/${lang}/articles/${a.slug}`} 
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {a.title}
              </Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{a.lead}</p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(a.published_at).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU')}
            </div>
            <Link
              href={`/${lang}/articles/${a.slug}`} 
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              {t.articles?.readMore} →
            </Link>
          </div>
        </div>
      ))}
      {articles.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
          Публикаций пока нет.
        </div>
      )}
    </div>
  )
}
