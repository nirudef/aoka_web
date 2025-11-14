'use client'

import { useState, useEffect } from 'react'
import { validateUserForm, type ValidationErrorKey } from '@/lib/validation/userForm'
import { revalidateUser } from '@/lib/actions/userActions'
import { useRouter } from 'next/navigation'

interface Branch {
  id: string
  name: string
}

interface LawOffice {
  id: string
  name: string
}

interface RoleOption {
  value: string
  label: string
}

type FormData = {
  first_name: string
  last_name: string
  email: string
  license_number?: string | null
  license_issued_at?: string | null
  joined_at?: string | null
  iin?: string
  phone?: string
}

const ERROR_TO_FIELD_MAP: Record<ValidationErrorKey, string> = {
  firstNameRequired: 'first_name',
  lastNameRequired: 'last_name',
  emailInvalid: 'email',
  licenseNumberRequired: 'license_number',
  licenseIssuedAtRequired: 'license_issued_at',
  joinedAtRequired: 'joined_at',
  iinInvalid: 'iin',
  phoneInvalid: 'phone',
}

interface Translation {
  form: {
    editUser: string
    createUser: string
    personalData: string
    firstName: string
    lastName: string
    middleName: string
    iin: string
    phone: string
    email: string
    password: string
    passwordPlaceholder: string
    professionalData: string
    licenseNumber: string
    licenseIssuedAt: string
    joinedAt: string
    workplace: string
    branch: string
    lawOffice: string
    address: string
    roles: string
    rolesHint: string
    saveSelf: string
    saveOther: string
    create: string
  }
  messages: {
    success: {
      profileUpdated: string
      userSaved: string
      userCreated: string
    }
    error: {
      network: string
      validation: string
      saveFailed: string
      userNotFound: string
      unauthorized: string
      duplicateEmail: string
      firstNameRequired: string
      lastNameRequired: string
      emailInvalid: string
      licenseNumberRequired: string
      licenseIssuedAtRequired: string
      joinedAtRequired: string
      iinInvalid: string
      phoneInvalid: string
    }
  }
  common: {
    notSelected: string
  }
}

type EditMode = 'self' | 'admin' | 'create'

interface Props {
  t: Translation
  mode: EditMode
  userId?: string          // optional для create
  currentUserId?: string   // optional, не нужен при create
  currentUserRoles?: string[]
  branches: Branch[]
  lawOffices: LawOffice[]
  rolesOptions: RoleOption[]
}

// 🔹 Надёжная генерация пароля (без Math.random)
function generateStrongPassword(length = 12): string {
  if (typeof window === 'undefined') return 'temp' + Date.now() // SSR fallback

  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  const array = new Uint32Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array, n => charset[n % charset.length]).join('')
}

export default function EditUserForm({
  t,
  mode,
  userId,
  currentUserId,
  currentUserRoles,
  branches,
  lawOffices,
  rolesOptions
}: Props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Поля пользователя
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [iin, setIin] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // только для create
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseIssuedAt, setLicenseIssuedAt] = useState('')
  const [joinedAt, setJoinedAt] = useState('')
  const [branchId, setBranchId] = useState<string | null>(null)
  const [lawOfficeId, setLawOfficeId] = useState<string | null>(null)
  const [address, setAddress] = useState('')
  const [roles, setRoles] = useState<string[]>([])

  const router = useRouter()

  // 🔹 Режимы
  const isCreate = mode === 'create'
  const isSelf = !isCreate && currentUserId === userId
  const isCurrentUserAdmin = currentUserRoles?.includes('admin')
  const canEditRoles = mode === 'admin' || mode === 'create' || (isSelf && isCurrentUserAdmin)

  // 🔹 Live-validation
  const getFieldError = (
    fieldName: string,
    value: string,
    allData: FormData,
    isLawyer: boolean
  ): string | null => {
    const data = { ...allData, [fieldName]: value }
    const errorKey = validateUserForm(data, { isLawyer })
    if (!errorKey) return null

    const affectedField = ERROR_TO_FIELD_MAP[errorKey]
    if (affectedField === fieldName) {
      return t.messages.error[errorKey] || t.messages.error.validation
    }
    return null
  }

  // 🔹 Загрузка данных (только при редактировании)
  useEffect(() => {
    if (isCreate) {
      setLoading(false)
      return
    }

    if (!userId) {
      setError(t.messages.error.userNotFound)
      setLoading(false)
      return
    }

    const loadUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`)
        if (!res.ok) {
          if (res.status === 404) throw new Error('user_not_found')
          if (res.status === 403) throw new Error('unauthorized')
          if (res.status === 409) throw new Error('duplicate_email')
          throw new Error('network')
        }
        const u = await res.json()

        setFirstName(u.first_name || '')
        setLastName(u.last_name || '')
        setMiddleName(u.middle_name || '')
        setIin(u.iin || '')
        setPhone(u.phone || '')
        setEmail(u.email || '')
        setLicenseNumber(u.license_number || '')
        setLicenseIssuedAt(u.license_issued_at?.split('T')[0] || '')
        setJoinedAt(u.joined_at?.split('T')[0] || '')
        setBranchId(u.branch_id || null)
        setLawOfficeId(u.law_office_id || null)
        setAddress(u.address || '')
        setRoles(u.roles || [])
      } catch (err: any) {
        const key = 
          err.message === 'user_not_found' ? 'userNotFound' :
          err.message === 'unauthorized' ? 'unauthorized' :
          err.message === 'duplicate_email' ? 'duplicateEmail' :
          'network'
        setError(t.messages.error[key as keyof typeof t.messages.error] || t.messages.error.saveFailed)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [userId, isCreate, t.messages.error])

  // 🔹 Отправка
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Валидация данных
    const errorKey = validateUserForm(
      {
        first_name: firstName,
        last_name: lastName,
        email,
        license_number: licenseNumber,
        license_issued_at: licenseIssuedAt,
        joined_at: joinedAt,
        iin,
        phone,
      },
      { isLawyer: roles.includes('lawyer') }
    )

    if (errorKey) {
      const message = t.messages.error[errorKey] || t.messages.error.validation
      setError(message)

      const field = ERROR_TO_FIELD_MAP[errorKey]
      if (field) {
        setFieldErrors(prev => ({ ...prev, [field]: message }))
        document.querySelector(`[name="${field}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Собираем payload
    const isLawyer = roles.includes('lawyer')
    const finalPassword = isCreate
      ? password || generateStrongPassword()
      : undefined

    const payload: Record<string, any> = {
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName || null,
      iin: iin || null,
      phone: phone || null,
      email,
      license_number: licenseNumber || null,
      license_issued_at: licenseIssuedAt || null,
      joined_at: joinedAt || null,
      branch_id: branchId,
      law_office_id: lawOfficeId,
      address: branchId || lawOfficeId ? null : address,
      roles,
    }

    if (isCreate) {
      payload.password = finalPassword
    }

    try {
      const url = isCreate
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`
      const method = isCreate ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        let message = ''
        if (isCreate) {
          message = t.messages.success.userCreated
          // Показываем пароль только при создании
          if (password === '') {
            alert(`✅ ${message}\n\nПароль: ${finalPassword}\n\nСкопируйте и передайте пользователю.`)
          } else {
            alert(`✅ ${message}`)
          }
        } else if (isSelf) {
          message = t.messages.success.profileUpdated
        } else {
          message = t.messages.success.userSaved
        }

        setSuccess(message)

        // Обновление
        setTimeout(() => {
          if (isCreate) {
            router.push(`/ru/cabinet/users`) // ← можно lang
          } else if (isSelf) {
            if (currentUserId) {
              revalidateUser()
            }
            router.refresh()
          } else {
            router.back()
          }
        }, 1200)
      } else {
        const data = await res.json().catch(() => ({}))
        const key = 
          data.error_code === 'validation_failed' ? 'validation' :
          data.error_code === 'duplicate_email' ? 'duplicateEmail' :
          'saveFailed'
        setError(t.messages.error[key] || t.messages.error.saveFailed)
      }
    } catch {
      setError(t.messages.error.network)
    }
  }

  // 🔹 Вспомогательные функции
  const handleFieldChange = (setter: (val: string) => void, fieldName: string) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setter(value)
      if (fieldErrors[fieldName]) {
        setFieldErrors(prev => ({ ...prev, [fieldName]: '' }))
      }
    }

  const handleFieldBlur = (fieldName: string, value: string) => {
    const err = getFieldError(
      fieldName,
      value,
      { first_name: firstName, last_name: lastName, email, license_number: licenseNumber, license_issued_at: licenseIssuedAt, joined_at: joinedAt, iin, phone },
      roles.includes('lawyer')
    )
    setFieldErrors(prev => ({ ...prev, [fieldName]: err || '' }))
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
        {isCreate ? t.form.createUser : t.form.editUser}
      </h2>

      {/* Персональные данные */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-gray-700 dark:text-gray-300 border-b pb-2">
          {t.form.personalData}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.lastName}</label>
            <input
              name="last_name"
              value={lastName}
              onChange={handleFieldChange(setLastName, 'last_name')}
              onBlur={() => handleFieldBlur('last_name', lastName)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.last_name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              required
            />
            {fieldErrors.last_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.last_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.firstName}</label>
            <input
              name="first_name"
              value={firstName}
              onChange={handleFieldChange(setFirstName, 'first_name')}
              onBlur={() => handleFieldBlur('first_name', firstName)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.first_name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              required
            />
            {fieldErrors.first_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.first_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.middleName}</label>
            <input
              value={middleName}
              onChange={e => setMiddleName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.iin}</label>
            <input
              name="iin"
              value={iin}
              onChange={handleFieldChange(setIin, 'iin')}
              onBlur={() => handleFieldBlur('iin', iin)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.iin ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            />
            {fieldErrors.iin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.iin}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.phone}</label>
            <input
              name="phone"
              value={phone}
              onChange={handleFieldChange(setPhone, 'phone')}
              onBlur={() => handleFieldBlur('phone', phone)}
              type="tel"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            />
            {fieldErrors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.email}</label>
            <input
              name="email"
              value={email}
              onChange={handleFieldChange(setEmail, 'email')}
              onBlur={() => handleFieldBlur('email', email)}
              type="email"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
              required
            />
            {fieldErrors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>}
          </div>
          {isCreate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.password}</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder={t.form.passwordPlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* Профессиональные данные */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-gray-700 dark:text-gray-300 border-b pb-2">
          {t.form.professionalData}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.licenseNumber}</label>
            <input
              name="license_number"
              value={licenseNumber}
              onChange={handleFieldChange(setLicenseNumber, 'license_number')}
              onBlur={() => handleFieldBlur('license_number', licenseNumber)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.license_number ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            />
            {fieldErrors.license_number && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.license_number}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.licenseIssuedAt}</label>
            <input
              name="license_issued_at"
              value={licenseIssuedAt}
              onChange={e => {
                setLicenseIssuedAt(e.target.value)
                if (fieldErrors.license_issued_at) setFieldErrors(prev => ({ ...prev, license_issued_at: '' }))
              }}
              onBlur={() => handleFieldBlur('license_issued_at', licenseIssuedAt)}
              type="date"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.license_issued_at ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            />
            {fieldErrors.license_issued_at && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.license_issued_at}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.joinedAt}</label>
            <input
              name="joined_at"
              value={joinedAt}
              onChange={e => {
                setJoinedAt(e.target.value)
                if (fieldErrors.joined_at) setFieldErrors(prev => ({ ...prev, joined_at: '' }))
              }}
              onBlur={() => handleFieldBlur('joined_at', joinedAt)}
              type="date"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                fieldErrors.joined_at ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
              }`}
            />
            {fieldErrors.joined_at && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.joined_at}</p>}
          </div>
        </div>
      </fieldset>

      {/* Место работы */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-gray-700 dark:text-gray-300 border-b pb-2">
          {t.form.workplace}
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.branch}</label>
            <select
              value={branchId || ''}
              onChange={e => {
                setBranchId(e.target.value || null)
                if (e.target.value) setLawOfficeId(null)
              }}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">{t.common.notSelected}</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.lawOffice}</label>
            <select
              value={lawOfficeId || ''}
              onChange={e => {
                setLawOfficeId(e.target.value || null)
                if (e.target.value) setBranchId(null)
              }}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">{t.common.notSelected}</option>
              {lawOffices.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          {!branchId && !lawOfficeId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.form.address}</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* Роли */}
      {canEditRoles && (
        <fieldset className="space-y-2">
          <legend className="font-semibold text-lg text-gray-700 dark:text-gray-300">{t.form.roles}</legend>
          <select
            multiple
            value={roles}
            onChange={e => setRoles(Array.from(e.target.selectedOptions, o => o.value))}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[120px]"
          >
            {rolesOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.form.rolesHint}</p>
        </fieldset>
      )}

      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
      {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">{success}</div>}

      <div className="pt-2 flex flex-wrap gap-3">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {isCreate ? t.form.create : isSelf ? t.form.saveSelf : t.form.saveOther}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium rounded-lg transition"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
