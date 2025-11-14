// app/[lang]/cabinet/profile/ProfileView.tsx
import { User as UserIcon, Mail, Phone, Calendar, Building2, MapPin, BadgeCheck, User } from 'lucide-react'
// import ProfileEditButton from './ProfileEditButton'
import Link from 'next/link'

interface User {
  id: string
  email: string
  verified: boolean
  first_name?: string
  last_name?: string
  middle_name?: string
  phone?: string
  iin?: string
  license_number?: string
  license_issued_at?: string | null
  joined_at?: string | null
  branch_id?: string | null
  law_office_id?: string | null
  address?: string
  roles: string[]
}

interface Translation {
  cabinet: {
    profile: string
    edit: string
    personalData: string
    professionalData: string
    workplace: string
    id: string
    email: string
    name: string
    phone: string
    iin: string
    licenseNumber: string
    licenseIssuedAt: string
    joinedAt: string
    branch: string
    lawOffice: string
    address: string
    roles: string
    status: {
      verified: string
      unverified: string
    }
  }
  role_guest: string
  role_lawyer: string
  role_accountant: string
  role_admin: string
  role_branch_head: string
}

const roleLabels: Record<string, string> = {
  guest: 'role_guest',
  lawyer: 'role_lawyer',
  accountant: 'role_accountant',
  admin: 'role_admin',
  branch_head: 'role_branch_head',
}

export default function ProfileView({
  user,
  t,
  branches,
  lawOffices,
  lang
}: {
  user: User
  t: Translation
  branches: { id: string; name: string }[]
  lawOffices: { id: string; name: string }[]
  lang: string
}) {
  // Найдём названия по ID
  const branchName = branches.find(b => b.id === user.branch_id)?.name
  const lawOfficeName = lawOffices.find(l => l.id === user.law_office_id)?.name

  // Формат даты: "2024-05-12" → "12.05.2024"
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('ru-RU').format(d)
  }

  return (
    <div className="space-y-6">
      {/* Заголовок + кнопка */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t.cabinet.profile}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.last_name} {user.first_name} {user.middle_name || ''}
          </p>
        </div>
        {/* <button
          onClick={() => (window.location.href = `/${t._lang}/cabinet/profile/edit`)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2"
        >
          <UserIcon className="w-4 h-4" />
          {t.cabinet.edit}
        </button> */}
        <Link href={`/${lang}/cabinet/users/${user.id}/edit`} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2">
          <User className="w-4 h-4" />
          Редактировать
        </Link>
        {/* <ProfileEditButton lang={lang} user={user} /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Личные данные */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
            {t.cabinet.personalData}
          </h3>
          <div className="space-y-3">
            <DataRow label={t.cabinet.id} value={user.id} icon={<UserIcon className="text-gray-500" />} />
            <DataRow label={t.cabinet.email} value={user.email} icon={<Mail className="text-gray-500" />} />
            <DataRow
              label={t.cabinet.name}
              value={`${user.last_name} ${user.first_name}${user.middle_name ? ` ${user.middle_name}` : ''}`}
              icon={<UserIcon className="text-gray-500" />}
            />
            <DataRow label={t.cabinet.phone} value={user.phone || '—'} icon={<Phone className="text-gray-500" />} />
            <DataRow label={t.cabinet.iin} value={user.iin || '—'} icon={<BadgeCheck className="text-gray-500" />} />
            <DataRow
              label={t.cabinet.status.verified}
              value={
                user.verified ? (
                  <span className="inline-flex items-center text-green-600">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    {t.cabinet.status.verified}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-yellow-600">
                    <BadgeCheck className="w-4 h-4 mr-1 opacity-50" />
                    {t.cabinet.status.unverified}
                  </span>
                )
              }
              icon={<BadgeCheck className="text-gray-500" />}
            />
          </div>
        </section>

        {/* Профессиональные данные */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            {t.cabinet.professionalData}
          </h3>
          <div className="space-y-3">
            <DataRow
              label={t.cabinet.licenseNumber}
              value={user.license_number || '—'}
              icon={<BadgeCheck className="text-gray-500" />}
            />
            <DataRow
              label={t.cabinet.licenseIssuedAt}
              value={formatDate(user.license_issued_at)}
              icon={<Calendar className="text-gray-500" />}
            />
            <DataRow
              label={t.cabinet.joinedAt}
              value={formatDate(user.joined_at)}
              icon={<Calendar className="text-gray-500" />}
            />
            <DataRow
              label={t.cabinet.roles}
              value={
                user.roles
                  .map(r => {
                    const key = roleLabels[r] as keyof Translation
                    return t[key] || r
                  })
                  .join(', ') || '—'
              }
              icon={<UserIcon className="text-gray-500" />}
            />
          </div>
        </section>

        {/* Место работы */}
        <section className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            {t.cabinet.workplace}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DataRow
              label={t.cabinet.branch}
              value={branchName || '—'}
              icon={<Building2 className="text-gray-500" />}
            />
            <DataRow
              label={t.cabinet.lawOffice}
              value={lawOfficeName || '—'}
              icon={<Building2 className="text-gray-500" />}
            />
            <DataRow
              label={t.cabinet.address}
              value={user.address || '—'}
              icon={<MapPin className="text-gray-500" />}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

// Вспомогательный компонент строки
const DataRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) => (
  <div className="flex items-start">
    <div className="mt-0.5 mr-3 text-gray-400 dark:text-gray-500">{icon}</div>
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
    </div>
  </div>
)
