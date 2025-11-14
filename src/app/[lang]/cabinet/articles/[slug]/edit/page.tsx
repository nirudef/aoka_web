// app/[lang]/cabinet/articles/[slug]/edit/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import ArticleForm from '../../ArticleForm'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user?.roles?.includes('admin')) {
    redirect(`/${lang}/cabinet/profile`)
  }

  let article = null
  let isEdit = slug !== 'new'

  if (isEdit) {
    // Загружаем статью
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${slug}?lang=${lang}&edit=1`)
    if (res.ok) {
      article = await res.json()
      console.log('article.status:', article.status, typeof article.status)
    } else {
      redirect(`/${lang}/cabinet/articles`)
    }
  }

  // Загружаем категории
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?lang=${lang}`)
  const { categories } = await categoriesRes.json()

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit 
          ? t.cabinet?.articles?.edit ?? 'Редактирование публикации' 
          : t.cabinet?.articles?.create ?? 'Создание публикации'}
      </h1>

      <ArticleForm 
        article={article} 
        categories={categories} 
        lang={lang} 
        t={t} 
      />
    </div>
  )
}
