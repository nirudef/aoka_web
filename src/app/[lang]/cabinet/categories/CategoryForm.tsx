// app/[lang]/cabinet/categories/CategoryForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Hash } from 'lucide-react'

interface Category {
  id?: string
  key: string
  position: number
  translations: {
    ru: CategoryTranslation
    kk: CategoryTranslation
    en: CategoryTranslation
  }
}

interface CategoryTranslation {
  name: string
}

interface Translation {
  cabinet: {
    categories: {
      key: string
      position: string
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

export default function CategoryForm({
  category,
  lang,
  t,
}: {
  category: Category | null
  lang: string
  t: Translation
}) {
  const [data, setData] = useState({
    key: '',
    position: 0,
    ru: '',
    kk: '',
    en: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (category) {
        // Предполагаем, что API отдаёт: { id, key, position, translations: { ru: { name: ... }, ... } }
        const translations = category.translations || {}

        setData({
        key: category.key,
        position: category.position,
        ru: translations.ru?.name || '',
        kk: translations.kk?.name || '',
        en: translations.en?.name || '',
        })
    } else {
        setData({
        key: '',
        position: 0,
        ru: '',
        kk: '',
        en: '',
        })
    }
    }, [category])

  const handleChange = (field: string, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleTranslationChange = (locale: 'ru' | 'kk' | 'en', value: string) => {
    setData(prev => ({ ...prev, [locale]: value }))
  }

  const validate = () => {
    if (!data.key.trim()) {
      setError('Ключ обязателен (только a-z, _)')
      return false
    }
    if (!/^[a-z_]+$/.test(data.key)) {
      setError('Ключ: только строчные латинские буквы и _')
      return false
    }
    if (!data.ru.trim()) {
      setError('Название на русском обязательно')
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
      category: {
        key: data.key,
        position: data.position,
        translations: [
          { locale: 'ru', name: data.ru },
          { locale: 'kk', name: data.kk },
          { locale: 'en', name: data.en },
        ]
      }
    }

    try {
      const url = category?.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${category.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`
      
      const method = category?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert(t.cabinet.categories.saved)
        router.push(`/${lang}/cabinet/categories`)
      } else {
        const err = await res.json()
        setError(err.error || t.cabinet.categories.error)
      }
    } catch (e) {
      setError(t.cabinet.categories.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <Hash className="w-4 h-4 inline mr-1" /> {t.cabinet.categories.key}*
        </label>
        <input
          value={data.key}
          onChange={e => handleChange('key', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
          placeholder="contest"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Только строчные латинские буквы и `_`. Пример: `news`, `contest`</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Позиция (для сортировки)
        </label>
        <input
          type="number"
          value={data.position}
          onChange={e => handleChange('position', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Переводы */}
      {(['ru', 'kk', 'en'] as const).map(langKey => (
        <div key={langKey}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Globe className="w-4 h-4 inline mr-1" />
            {langKey === 'ru' && t.cabinet.categories.ru}
            {langKey === 'kk' && t.cabinet.categories.kk}
            {langKey === 'en' && t.cabinet.categories.en}
            {langKey === 'ru' && '*'}
          </label>
          <input
            value={data[langKey]}
            onChange={e => handleTranslationChange(langKey, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required={langKey === 'ru'}
          />
        </div>
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
              {t.cabinet.categories.saving}
            </>
          ) : (
            t.cabinet.categories.save
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
