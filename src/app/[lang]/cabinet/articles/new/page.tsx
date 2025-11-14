// app/[lang]/cabinet/articles/new/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import ArticleForm from '../ArticleForm'

export default async function NewArticlePage({ 
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

  // Загружаем категории
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?lang=${lang}`)
  const { categories } = await categoriesRes.json()

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {t.cabinet?.articles?.create ?? 'Создание публикации'}
      </h1>

      <ArticleForm 
        article={null} 
        categories={categories} 
        lang={lang} 
        t={t} 
      />
    </div>
  )
}
