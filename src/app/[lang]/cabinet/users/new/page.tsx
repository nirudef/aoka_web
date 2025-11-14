// 'use client'

// import { useState } from 'react'

// interface Branch {
//   id: string
//   name: string
// }

// interface LawOffice {
//   id: string
//   name: string
// }

// interface RoleOption {
//   value: string
//   label: string
// }

// interface Props {
//   branches: Branch[]
//   lawOffices: LawOffice[]
//   rolesOptions: RoleOption[]
// }

// export default function CreateUserForm({ branches, lawOffices, rolesOptions }: Props) {
//   const [firstName, setFirstName] = useState('')
//   const [lastName, setLastName] = useState('')
//   const [middleName, setMiddleName] = useState('')
//   const [iin, setIin] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const [licenseNumber, setLicenseNumber] = useState('')
//   const [licenseIssuedAt, setLicenseIssuedAt] = useState('')
//   const [joinedAt, setJoinedAt] = useState('')
//   const [branchId, setBranchId] = useState<string | null>(null)
//   const [lawOfficeId, setLawOfficeId] = useState<string | null>(null)
//   const [newLawOffice, setNewLawOffice] = useState('')
//   const [address, setAddress] = useState('')
//   const [roles, setRoles] = useState<string[]>([])
//   const [error, setError] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     // валидация
//     if (!lastName || !firstName || !email) {
//       setError('Пожалуйста, заполните обязательные поля: Фамилия, Имя, Email.')
//       return
//     }

//     if (!branchId && !lawOfficeId && !newLawOffice && !address) {
//       setError('Пожалуйста, укажите адрес работы (если не выбран филиал или контора).')
//       return
//     }

//     const payload = {
//       first_name: firstName,
//       last_name: lastName,
//       middle_name: middleName || null,
//       iin,
//       phone,
//       email,
//       license_number: licenseNumber,
//       license_issued_at: licenseIssuedAt || null,
//       joined_at: joinedAt || null,
//       branch_id: branchId,
//       law_office_id: lawOfficeId,
//       new_law_office: newLawOffice || null,
//       address: branchId || lawOfficeId || newLawOffice ? null : address,
//       roles,
//     }

//     const res = await fetch('/api/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     })

//     if (res.ok) {
//       alert('Пользователь создан')
//       // сброс формы
//       setFirstName(''); setLastName(''); setMiddleName('')
//       setIin(''); setPhone(''); setEmail('')
//       setLicenseNumber(''); setLicenseIssuedAt(''); setJoinedAt('')
//       setBranchId(null); setLawOfficeId(null); setNewLawOffice(''); setAddress('')
//       setRoles([])
//     } else {
//       const data = await res.json()
//       setError(data.error || 'Ошибка создания пользователя')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
//       <h2 className="text-2xl font-bold border-b pb-2 mb-4">Создание пользователя</h2>

//       {/* Персональные данные */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Персональные данные</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <input className="input" placeholder="Фамилия*" value={lastName} onChange={e => setLastName(e.target.value)} required />
//           <input className="input" placeholder="Имя*" value={firstName} onChange={e => setFirstName(e.target.value)} required />
//           <input className="input" placeholder="Отчество" value={middleName} onChange={e => setMiddleName(e.target.value)} />
//           <input className="input" placeholder="ИИН" value={iin} onChange={e => setIin(e.target.value)} />
//           <input className="input" placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} />
//           <input className="input" type="email" placeholder="Email*" value={email} onChange={e => setEmail(e.target.value)} required />
//         </div>
//       </section>

//       {/* Профессиональные данные */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Профессиональные данные</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <input className="input" placeholder="№ лицензии" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
//           <input className="input" type="date" placeholder="Дата выдачи лицензии" value={licenseIssuedAt} onChange={e => setLicenseIssuedAt(e.target.value)} />
//           <input className="input" type="date" placeholder="Дата вступления в Коллегию" value={joinedAt} onChange={e => setJoinedAt(e.target.value)} />
//         </div>
//       </section>

//       {/* Филиал / Контора / Адрес */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Место работы</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <select
//             className="input"
//             value={branchId || ''}
//             onChange={e => {
//               setBranchId(e.target.value || null)
//               if (e.target.value) { setLawOfficeId(null); setNewLawOffice(''); setAddress('') }
//             }}
//           >
//             <option value="">— Филиал не выбран —</option>
//             {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//           </select>

//           <select
//             className="input"
//             value={lawOfficeId || ''}
//             onChange={e => {
//               setLawOfficeId(e.target.value || null)
//               if (e.target.value) { setBranchId(null); setNewLawOffice(''); setAddress('') }
//             }}
//           >
//             <option value="">— Контора не выбрана —</option>
//             {lawOffices.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>

//           {!branchId && !lawOfficeId && (
//             <input
//               className="input"
//               placeholder="Адрес"
//               value={address}
//               onChange={e => setAddress(e.target.value)}
//             />
//           )}

//           {!branchId && !lawOfficeId && (
//             <input
//               className="input"
//               placeholder="Создать новую контору"
//               value={newLawOffice}
//               onChange={e => setNewLawOffice(e.target.value)}
//             />
//           )}
//         </div>
//       </section>

//       {/* Роли */}
//       <section className="space-y-2">
//         <h3 className="font-semibold text-lg">Роли</h3>
//         <select
//           className="input"
//           multiple
//           value={roles}
//           onChange={e => setRoles(Array.from(e.target.selectedOptions, o => o.value))}
//         >
//           {rolesOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
//         </select>
//         {branchId && roles.includes('branch_head') && (
//           <p className="text-sm text-gray-500">Пользователь будет руководителем филиала</p>
//         )}
//       </section>

//       {error && <p className="text-red-500">{error}</p>}

//       <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
//         Создать пользователя
//       </button>
//     </form>
//   )
// }

import { getTranslations } from '@/lib/i18n'
import type { Metadata } from 'next'
// import CreateUserForm from './CreateUserForm'
import EditUserForm from '../[id]/edit/EditUserForm'

const SUPPORTED = ['ru', 'kk', 'en'] as const
type Locale = (typeof SUPPORTED)[number]

interface Params {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : 'ru'
  const t = await getTranslations(locale)

  return {
    title: t.users?.createTitle ?? 'Создание пользователя',
    description: t.users?.createDescription ?? 'Форма создания нового пользователя',
  }
}

export default async function CreateUserPage({ params }: Params) {
  const { lang } = await params
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : 'ru'
  const t = await getTranslations(locale)

  // Загружаем филиалы
  const branches: { id: string; name: string }[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${locale}`
  )
    .then(res => res.json())
    .then(data =>
      data.map((b: any) => ({
        id: b.id,
        name: b.translations?.[locale]?.name ?? b.translations?.ru?.name ?? '',
      }))
    )
    .catch(() => [])

  // Загружаем адвокатские конторы
  const lawOffices: { id: string; name: string }[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices?lang=${locale}`
  )
    .then(res => res.json())
    .then(data =>
      data.map((l: any) => ({
        id: l.id,
        name: l.translations?.[locale]?.name ?? l.translations?.ru?.name ?? '',
      }))
    )
    .catch(() => [])

  // Опции ролей
  const rolesOptions = [
    { value: 'guest', label: 'Гость' },
    { value: 'lawyer', label: 'Адвокат' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'admin', label: 'Админ' },
    { value: 'branch_head', label: 'Заведующий филиалом' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t.users?.createTitle}</h1>
      <EditUserForm
        mode="create"
        t={t}
        branches={branches}
        lawOffices={lawOffices}
        rolesOptions={rolesOptions}
      />
    </div>
  )
}
