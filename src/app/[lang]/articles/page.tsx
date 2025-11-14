// app/[lang]/articles/page.tsx
import { getTranslations } from '@/lib/i18n'
import { ArticleList } from './ArticleList'

export default async function ArticlesPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params
  const t = await getTranslations(lang)

  // Загружаем опубликованные статьи
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/articles?lang=${lang}&status=published`, {
    next: { revalidate: 60 }, // ISR: обновлять каждые 60 сек
  })
  const { articles } = await res.json()

  // Загружаем категории для фильтра
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?lang=${lang}`)
  const { categories } = await categoriesRes.json()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {t.articles?.title ?? 'Публикации'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t.articles?.description ?? 'Актуальные новости, объявления и конкурсы Алматинской областной коллегии адвокатов.'}
        </p>
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

// Генерация метаданных
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)
  return {
    title: t.articles?.metaTitleArticle ?? 'Публикации — АОКА',
    description: t.articles?.metaDescriptionArticle ?? 'Новости и объявления Алматинской областной коллегии адвокатов.',
  }
}
