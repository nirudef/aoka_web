'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, MapPin, Mail, Phone, Save, X, Plus, Edit3, Trash2 } from 'lucide-react'

interface BranchTranslation {
  name: string
  address: string
  description?: string
}

interface Branch {
  id?: string
  phone?: string
  email?: string
  latitude?: string
  longitude?: string
  translations: {
    ru: BranchTranslation
    kk: BranchTranslation
    en: BranchTranslation
  }
}

interface Props {
  params: Promise<{ lang: string }>
}

export default function BranchesPage({ params }: Props) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { lang } = await params
        const locale = lang || 'ru'

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${locale}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        const normalized: Branch[] = data.map((b: any) => ({
          id: b.id,
          phone: b.phone || '',
          email: b.email || '',
          latitude: b.latitude || '',
          longitude: b.longitude || '',
          translations: {
            ru: b.translations?.ru || { name: '', address: '', description: '' },
            kk: b.translations?.kk || { name: '', address: '', description: '' },
            en: b.translations?.en || { name: '', address: '', description: '' },
          },
        }))
        setBranches(normalized)
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить филиалы')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [params])

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Вы уверены, что хотите удалить этот филиал?')) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setBranches((prev) => prev.filter((b) => b.id !== id))
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении')
    }
  }

  const handleSave = async (branch: Branch) => {
    // 🔹 Валидация
    const errors: string[] = []
    ;(['ru', 'kk', 'en'] as const).forEach(lang => {
      if (!branch.translations[lang].name.trim()) {
        errors.push(`Название на ${lang.toUpperCase()} обязательно`)
      }
    })
    if (!branch.email?.trim()) errors.push('Email обязателен')
    if (!branch.phone?.trim()) errors.push('Телефон обязателен')

    if (errors.length > 0) {
      setError(errors.join('; '))
      return
    }

    setSaving(true)
    try {
      let savedBranch: Branch
      if (branch.id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches/${branch.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branch }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        savedBranch = { ...branch }
        setBranches((prev) => prev.map((b) => (b.id === branch.id ? savedBranch : b)))
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branch }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        savedBranch = await res.json()
        setBranches((prev) => [...prev, savedBranch])
      }
      setEditingBranch(null)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  if (error) return <div className="max-w-4xl mx-auto p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Управление филиалами</h1>
        {!editingBranch && (
          <button
            onClick={() => setEditingBranch({
              translations: {
                ru: { name: '', address: '', description: '' },
                kk: { name: '', address: '', description: '' },
                en: { name: '', address: '', description: '' },
              },
            })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить филиал
          </button>
        )}
      </div>

      {editingBranch && (
        <BranchForm
          branch={editingBranch}
          onSave={handleSave}
          onCancel={() => {
            setEditingBranch(null)
            setError(null)
          }}
          saving={saving}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RU / KZ / EN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Контакты</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{b.translations.ru.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {b.translations.kk.name} / {b.translations.en.name}
                    </div>
                    {b.translations.ru.address && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {b.translations.ru.address}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {b.phone && (
                      <div className="flex items-center mb-1">
                        <Phone className="w-3 h-3 mr-1 text-blue-500" />
                        {b.phone}
                      </div>
                    )}
                    {b.email && (
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-blue-500" />
                        {b.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingBranch({ ...b })}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded transition mr-2"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Редактировать
                    </button>
                    {b.id && (
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Удалить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {branches.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Нет филиалов. Нажмите «Добавить филиал», чтобы создать первый.
          </div>
        )}
      </div>
    </div>
  )
}

// 🔹 Форма редактирования
function BranchForm({ branch, onSave, onCancel, saving }: { 
  branch: Branch; 
  onSave: (b: Branch) => void; 
  onCancel: () => void; 
  saving: boolean 
}) {
  const [localBranch, setLocalBranch] = useState<Branch>({ ...branch })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    ;(['ru', 'kk', 'en'] as const).forEach(lang => {
      if (!localBranch.translations[lang].name.trim()) {
        errs[`name_${lang}`] = 'Обязательно'
      }
    })
    if (!localBranch.email?.trim()) errs.email = 'Обязательно'
    if (!localBranch.phone?.trim()) errs.phone = 'Обязательно'
    if (localBranch.email?.trim() && !/^\S+@\S+\.\S+$/.test(localBranch.email)) {
      errs.email = 'Некорректный email'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave(localBranch)
    }
  }

  const handleChange = (
    lang: keyof Branch['translations'],
    field: keyof BranchTranslation,
    value: string
  ) => {
    setLocalBranch({
      ...localBranch,
      translations: {
        ...localBranch.translations,
        [lang]: { ...localBranch.translations[lang], [field]: value },
      },
    })
  }

  const handleFieldChange = (field: keyof Branch, value: string) => {
    setLocalBranch({ ...localBranch, [field]: value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {localBranch.id ? 'Редактирование филиала' : 'Добавление филиала'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Локализации */}
        <div className="space-y-4">
          {(['ru', 'kk', 'en'] as const).map((lang) => (
            <fieldset key={lang} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {lang.toUpperCase()}
              </legend>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Название*
                  </label>
                  <input
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                      errors[`name_${lang}`] ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''
                    }`}
                    value={localBranch.translations[lang]?.name || ''}
                    onChange={(e) => handleChange(lang, 'name', e.target.value)}
                  />
                  {errors[`name_${lang}`] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {errors[`name_${lang}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Адрес
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    value={localBranch.translations[lang]?.address || ''}
                    onChange={(e) => handleChange(lang, 'address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Описание
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    value={localBranch.translations[lang]?.description || ''}
                    onChange={(e) => handleChange(lang, 'description', e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
          ))}
        </div>

        {/* Контакты и гео */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Телефон*
            </label>
            <input
              type="tel"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''
              }`}
              placeholder="+7 (727) 123-45-67"
              value={localBranch.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email*
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''
              }`}
              placeholder="filial@example.com"
              value={localBranch.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Широта (lat)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="43.238949"
              value={localBranch.latitude || ''}
              onChange={(e) => handleFieldChange('latitude', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Долгота (lng)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="76.889709"
              value={localBranch.longitude || ''}
              onChange={(e) => handleFieldChange('longitude', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium rounded-lg transition"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition gap-2 disabled:opacity-75"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {localBranch.id ? 'Сохранить изменения' : 'Создать филиал'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
