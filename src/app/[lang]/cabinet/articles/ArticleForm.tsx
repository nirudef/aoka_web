// app/[lang]/cabinet/articles/ArticleForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Globe, Hash, LinkIcon, Type } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'

interface Category {
  id: string
  key: string
  name: string
}

interface Article {
  id?: string
  slug: string
  status: string
  published_at: string
  category_id: string | null
  translations: {
    ru: ArticleTranslation
    kk: ArticleTranslation
    en: ArticleTranslation
  }
}

interface ArticleTranslation {
  title: string
  lead: string
  body: string
  meta_title: string
  meta_description: string
}

interface Translation {
  cabinet: {
    articles: {
      title: string
      slug: string
      status: string
      category: string
      publishedAt: string
      lead: string
      body: string
      metaTitle: string
      metaDescription: string
      ru: string
      kk: string
      en: string
      save: string
      saving: string
      saved: string
      error: string
    }
  }
}

// Транслитерация кириллицы в латиницу (ru/kk → slug)
function transliterateToSlug(text: string): string {
  const ruToEn: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya',
    // Казахские буквы
    'ә': 'a', 'ғ': 'g', 'қ': 'k', 'ң': 'n', 'ө': 'o',
    'ұ': 'u', 'ү': 'u', 'һ': 'h', 'і': 'i',
    // Заглавные
    'А': 'A', 'Ә': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G',
    'Ғ': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
    'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Қ': 'K',
    'Л': 'L', 'М': 'M', 'Н': 'N', 'Ң': 'N', 'О': 'O',
    'Ө': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
    'У': 'U', 'Ұ': 'U', 'Ү': 'U', 'Ф': 'F', 'Х': 'Kh',
    'Һ': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'І': 'I', 'Ь': '', 'Э': 'E',
    'Ю': 'Yu', 'Я': 'Ya'
  };

  return text
    .split('')
    .map(char => ruToEn[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // удаляем всё, кроме букв, цифр, пробелов, дефисов
    .replace(/\s+/g, '-')           // пробелы → дефисы
    .replace(/-+/g, '-')            // несколько дефисов → один
    .replace(/^-|-$/g, '');         // удаляем дефисы по краям
}

export default function ArticleForm({
  article,
  categories,
  lang,
  t,
}: {
  article: Article | null
  categories: Category[]
  lang: string
  t: Translation
}) {
  const [data, setData] = useState({
    ru: { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
    kk: { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
    en: { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
    slug: '',
    status: 'draft',
    published_at: '',
    category_id: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Инициализация из article
  useEffect(() => {
    if (article) {
    const translations = article.translations || {}

    setData({
      ru: translations.ru || { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
      kk: translations.kk || { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
      en: translations.en || { title: '', lead: '', body: '', meta_title: '', meta_description: '' },
      slug: article.slug,
      status: article.status,
      published_at: article.published_at 
        ? new Date(article.published_at).toISOString().slice(0, 16) 
        : '',
      category_id: article.category_id || '',
    })
  } else {
    // новая статья
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setData(prev => ({ ...prev, published_at: now.toISOString().slice(0, 16) }))
  }
}, [article])

// 🔹 Новый эффект: автогенерация slug из title_ru (только для новых статей)
useEffect(() => {
  if (!article && data.ru.title && !data.slug) {
    const slug = transliterateToSlug(data.ru.title)
      .substring(0, 60) // ограничим длину
      .replace(/^-+/, '') // удалим дефисы в начале
    setData(prev => ({ ...prev, slug }))
  }
}, [data.ru.title, article])

  const handleChange = (locale: 'ru' | 'kk' | 'en', field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value }
    }))
  }

  const handleFieldChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!data.ru.title.trim()) {
      setError('Заголовок на русском обязателен')
      return false
    }
    if (!data.slug.trim()) {
      setError('ЧПУ (slug) обязателен')
      return false
    }
    if (!data.published_at) {
      setError('Дата публикации обязательна')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)

    const payload = {
      article: {
        slug: data.slug,
        status: data.status,
        published_at: data.published_at,
        category_id: data.category_id || null,
        translations: [
          { locale: 'ru', ...data.ru },
          { locale: 'kk', ...data.kk },
          { locale: 'en', ...data.en },
        ]
      }
    }

    try {
      const url = article?.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles/${article.slug}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/articles`
      
      const method = article?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert(t.cabinet.articles.saved)
        router.push(`/${lang}/cabinet/articles`)
      } else {
        const err = await res.json()
        setError(err.error || t.cabinet.articles.error)
      }
    } catch (e) {
      setError(t.cabinet.articles.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основные поля */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Hash className="w-4 h-4 inline mr-1" /> {t.cabinet.articles.slug}
          </label>
          <div className="flex">
            <input
              value={data.slug}
              onChange={e => handleFieldChange('slug', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="konkurs-advokatov-2025"
              required
            />
            {!article && data.ru.title && !data.slug && (
              <button
                type="button"
                onClick={() => {
                  const slug = transliterateToSlug(data.ru.title).substring(0, 60)
                  setData(prev => ({ ...prev, slug }))
                }}
                className="px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600"
                title="Сгенерировать из заголовка"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Будет использован в URL: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">aoka.kz/ru/articles/{data.slug || '...'}</code>
          </p>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Hash className="w-4 h-4 inline mr-1" /> {t.cabinet.articles.slug}
          </label>
          <input
            value={data.slug}
            onChange={e => handleFieldChange('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="konkurs-advokatov-2025"
            required
          />
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Globe className="w-4 h-4 inline mr-1" /> {t.cabinet.articles.category}
          </label>
          <select
            value={data.category_id}
            onChange={e => handleFieldChange('category_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{t.cabinet.articles.category}...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" /> {t.cabinet.articles.publishedAt}
          </label>
          <input
            type="datetime-local"
            value={data.published_at}
            onChange={e => handleFieldChange('published_at', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Type className="w-4 h-4 inline mr-1" /> {t.cabinet.articles.status}
          </label>
          <select
            value={data.status}
            onChange={e => handleFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликовано</option>
            <option value="archived">Архив</option>
          </select>
        </div>
      </div>

      {/* Переводы */}
      {(['ru', 'kk', 'en'] as const).map(langKey => (
        <fieldset key={langKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {langKey === 'ru' && t.cabinet.articles.ru}
            {langKey === 'kk' && t.cabinet.articles.kk}
            {langKey === 'en' && t.cabinet.articles.en}
          </legend>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.title}*
              </label>
              <input
                value={data[langKey].title}
                onChange={e => handleChange(langKey, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required={langKey === 'ru'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.lead}
              </label>
              <input
                value={data[langKey].lead}
                onChange={e => handleChange(langKey, 'lead', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.body}*
              </label>
              <RichTextEditor
                content={data[langKey].body}
                onChange={(html) => handleChange(langKey, 'body', html)}
                placeholder={`Введите текст на ${langKey === 'ru' ? 'русском' : langKey === 'kk' ? 'казахском' : 'английском'}...`}
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.body}*
              </label>
              <textarea
                rows={6}
                value={data[langKey].body}
                onChange={e => handleChange(langKey, 'body', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                required={langKey === 'ru'}
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.metaTitle}
              </label>
              <input
                value={data[langKey].meta_title}
                onChange={e => handleChange(langKey, 'meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.cabinet.articles.metaDescription}
              </label>
              <input
                value={data[langKey].meta_description}
                onChange={e => handleChange(langKey, 'meta_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </fieldset>
      ))}

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-75"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline mr-2" />
              {t.cabinet.articles.saving}
            </>
          ) : (
            t.cabinet.articles.save
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium rounded-lg"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
