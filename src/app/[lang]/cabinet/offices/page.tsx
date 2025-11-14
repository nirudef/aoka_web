'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, MapPin, Mail, Phone, Save, X, Plus, Edit3, Trash2 } from 'lucide-react'

interface LawOfficeTranslation {
  name: string
  address: string
  description?: string
}

interface LawOffice {
  id?: string
  phone?: string
  email?: string
  latitude?: string
  longitude?: string
  translations: {
    ru: LawOfficeTranslation
    kk: LawOfficeTranslation
    en: LawOfficeTranslation
  }
}

interface Props {
  params: Promise<{ lang: string }>
}

export default function LawOfficesPage({ params }: Props) {
  const [lawOffices, setLawOffices] = useState<LawOffice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOffice, setEditingOffice] = useState<LawOffice | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchLawOffices = async () => {
      try {
        const { lang } = await params
        const locale = lang || 'ru'

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices?lang=${locale}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        const normalized: LawOffice[] = data.map((l: any) => ({
          id: l.id,
          phone: l.phone || '',
          email: l.email || '',
          latitude: l.latitude || '',
          longitude: l.longitude || '',
          translations: {
            ru: l.translations?.ru || { name: '', address: '', description: '' },
            kk: l.translations?.kk || { name: '', address: '', description: '' },
            en: l.translations?.en || { name: '', address: '', description: '' },
          },
        }))
        setLawOffices(normalized)
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить юридические конторы')
      } finally {
        setLoading(false)
      }
    }

    fetchLawOffices()
  }, [params])

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Вы уверены, что хотите удалить эту юридическую контору?')) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setLawOffices((prev) => prev.filter((l) => l.id !== id))
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении')
    }
  }

  const handleSave = async (office: LawOffice) => {
    // 🔹 Валидация (аналогично филиалам)
    const errors: string[] = []
    ;(['ru', 'kk', 'en'] as const).forEach(lang => {
      if (!office.translations[lang].name.trim()) {
        errors.push(`Название на ${lang.toUpperCase()} обязательно`)
      }
    })
    if (!office.email?.trim()) errors.push('Email обязателен')
    if (!office.phone?.trim()) errors.push('Телефон обязателен')

    if (errors.length > 0) {
      setError(errors.join('; '))
      return
    }

    setSaving(true)
    try {
      let savedOffice: LawOffice
      if (office.id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices/${office.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ office }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        savedOffice = { ...office }
        setLawOffices((prev) => prev.map((l) => (l.id === office.id ? savedOffice : l)))
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ office }),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        savedOffice = await res.json()
        setLawOffices((prev) => [...prev, savedOffice])
      }
      setEditingOffice(null)
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Управление юридическими конторами</h1>
        {!editingOffice && (
          <button
            onClick={() => setEditingOffice({
              translations: {
                ru: { name: '', address: '', description: '' },
                kk: { name: '', address: '', description: '' },
                en: { name: '', address: '', description: '' },
              },
            })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить контору
          </button>
        )}
      </div>

      {editingOffice && (
        <LawOfficeForm
          office={editingOffice}
          onSave={handleSave}
          onCancel={() => {
            setEditingOffice(null)
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
              {lawOffices.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{l.translations.ru.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {l.translations.kk.name} / {l.translations.en.name}
                    </div>
                    {l.translations.ru.address && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {l.translations.ru.address}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {l.phone && (
                      <div className="flex items-center mb-1">
                        <Phone className="w-3 h-3 mr-1 text-blue-500" />
                        {l.phone}
                      </div>
                    )}
                    {l.email && (
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-blue-500" />
                        {l.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingOffice({ ...l })}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded transition mr-2"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Редактировать
                    </button>
                    {l.id && (
                      <button
                        onClick={() => handleDelete(l.id)}
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
        {lawOffices.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Нет юридических контор. Нажмите «Добавить контору».
          </div>
        )}
      </div>
    </div>
  )
}

// 🔹 Форма (почти копия BranchForm, но для LawOffice)
function LawOfficeForm({ office, onSave, onCancel, saving }: { 
  office: LawOffice; 
  onSave: (l: LawOffice) => void; 
  onCancel: () => void; 
  saving: boolean 
}) {
  const [localOffice, setLocalOffice] = useState<LawOffice>({ ...office })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    ;(['ru', 'kk', 'en'] as const).forEach(lang => {
      if (!localOffice.translations[lang].name.trim()) {
        errs[`name_${lang}`] = 'Обязательно'
      }
    })
    if (!localOffice.email?.trim()) errs.email = 'Обязательно'
    if (!localOffice.phone?.trim()) errs.phone = 'Обязательно'
    if (localOffice.email?.trim() && !/^\S+@\S+\.\S+$/.test(localOffice.email)) {
      errs.email = 'Некорректный email'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      onSave(localOffice)
    }
  }

  const handleChange = (
    lang: keyof LawOffice['translations'],
    field: keyof LawOfficeTranslation,
    value: string
  ) => {
    setLocalOffice({
      ...localOffice,
      translations: {
        ...localOffice.translations,
        [lang]: { ...localOffice.translations[lang], [field]: value },
      },
    })
  }

  const handleFieldChange = (field: keyof LawOffice, value: string) => {
    setLocalOffice({ ...localOffice, [field]: value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {localOffice.id ? 'Редактирование конторы' : 'Добавление конторы'}
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
                    value={localOffice.translations[lang]?.name || ''}
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
                    value={localOffice.translations[lang]?.address || ''}
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
                    value={localOffice.translations[lang]?.description || ''}
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
              value={localOffice.phone || ''}
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
              placeholder="office@example.com"
              value={localOffice.email || ''}
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
              value={localOffice.latitude || ''}
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
              value={localOffice.longitude || ''}
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
              {localOffice.id ? 'Сохранить изменения' : 'Создать контору'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
