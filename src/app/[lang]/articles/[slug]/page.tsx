// app/[lang]/articles/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { ArticleView } from './ArticleView'

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const { lang, slug } = await params
  const t = await getTranslations(lang)

  // Загружаем статью
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/articles/${slug}?lang=${lang}`, {
    next: { revalidate: 300 }, // кэш 5 мин
  })

  if (!res.ok) notFound()

  const article = await res.json()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ArticleView article={article} lang={lang} t={t} />
    </div>
  )
}

// Генерация метаданных из статьи
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/articles/${slug}?lang=${lang}`)
  
  if (!res.ok) return {}

  const article = await res.json()
  
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.lead,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.lead,
      type: 'article',
      publishedTime: article.published_at,
    },
  }
}
