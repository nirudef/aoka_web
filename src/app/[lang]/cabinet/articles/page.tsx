// app/[lang]/cabinet/articles/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { ArticleList } from './ArticleList'

export default async function ArticlesPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  // 🔐 Только админ
  if (!user?.roles?.includes('admin')) {
    redirect(`/${lang}/cabinet/profile`)
  }

  // Загружаем статьи
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles?lang=${lang}`, { 
    next: { revalidate: 0 } 
  })
  const { articles } = await res.json()

  // Загружаем категории
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?lang=${lang}`)
  const { categories } = await categoriesRes.json()

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t.cabinet?.articles?.title ?? 'Публикации'}
        </h1>
        <a 
          href={`/${lang}/cabinet/articles/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t.cabinet?.articles?.new ?? 'Новая публикация'}
        </a>
      </div>

      <ArticleList 
        articles={articles} 
        categories={categories}
        lang={lang}
        t={t}
      />
    </div>
  )
}
