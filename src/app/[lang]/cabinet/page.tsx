// app/[lang]/cabinet/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
// import CabinetTabs from './CabinetTabs'
import GlobalNotification from '@/components/GlobalNotification'

export default async function CabinetPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user) redirect(`/${lang}/login`)

  // Загружаем справочники для формы редактирования
  const [branches, lawOffices] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${lang}`)
      .then(r => r.json())
      .then(data => data.map((b: any) => ({
        id: b.id,
        name: b.translations?.[lang]?.name ?? b.translations?.ru?.name ?? '',
      })))
      .catch(() => []),

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices?lang=${lang}`)
      .then(r => r.json())
      .then(data => data.map((l: any) => ({
        id: l.id,
        name: l.translations?.[lang]?.name ?? l.translations?.ru?.name ?? '',
      })))
      .catch(() => []),
  ])

  const rolesOptions = [
    { value: 'guest', label: 'Гость' },
    { value: 'lawyer', label: 'Адвокат' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'admin', label: 'Админ' },
    { value: 'branch_head', label: 'Заведующий филиалом' },
  ]

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">{t.cabinet.title}</h1>
      <GlobalNotification t={t} />
      <div className="space-y-2 text-sm sm:text-base">
        <p><strong>{t.cabinet.fields.id}:</strong> {user.id}</p>
        <p><strong>{t.cabinet.fields.email}:</strong> {user.email}</p>
        {user.first_name && (
          <p><strong>{t.cabinet.fields.name}:</strong> {user.last_name} {user.first_name} {user.middle_name ?? ''}</p>
        )}
        {user.phone && <p><strong>{t.cabinet.fields.phone}:</strong> {user.phone}</p>}
        <p>
          <strong>{t.cabinet.fields.status}:</strong>{' '}
          {user.verified ? (
            <span className="text-green-600">{t.cabinet.status.verified}</span>
          ) : (
            <span className="text-yellow-600">{t.cabinet.status.unverified}</span>
          )}
        </p>
        {Array.isArray(user.roles) && user.roles.length > 0 && (
          <p><strong>{t.cabinet.fields.roles}:</strong> {user.roles.map(r => t[`role_${r}`] || r).join(', ')}</p>
        )}
      </div>
    </div>
  )
}
