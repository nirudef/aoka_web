// app/[lang]/articles/[slug]/ArticleView.tsx
import { Calendar, Tag } from 'lucide-react'

interface Article {
  title: string
  lead: string
  body: string
  published_at: string
  category: { key: string; name: string } | null
}

interface Translation {
  articles: {
    publishedOn: string
    category: string
  }
}

export function ArticleView({ article, lang, t }: { 
  article: Article
  lang: string
  t: Translation 
}) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {article.category && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 mb-4">
          <Tag className="w-3 h-3 mr-1.5" />
          {article.category.name}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{article.title}</h1>
      
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
        <Calendar className="w-4 h-4 mr-1.5" />
        {t.articles?.publishedOn}{' '}
        <time dateTime={article.published_at}>
          {new Date(article.published_at).toLocaleDateString(
            lang === 'kk' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}
        </time>
      </div>

      {article.lead && (
        <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-6">
          {article.lead}
        </p>
      )}

      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    </article>
  )
}
