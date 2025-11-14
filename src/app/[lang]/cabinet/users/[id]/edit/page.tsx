// app/[lang]/cabinet/users/[id]/edit/page.tsx
import { getTranslations } from '@/lib/i18n'
import EditUserForm from './EditUserForm'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { redirect } from 'next/navigation'

const SUPPORTED = ['ru', 'kk', 'en'] as const
type Locale = (typeof SUPPORTED)[number]

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id } = await params
  const locale: Locale = SUPPORTED.includes(lang as Locale) ? (lang as Locale) : 'ru'
  const t = await getTranslations(locale)
  const currentUser = await getCurrentUser()

  // 🔹 1. Если не авторизован — редирект на логин
  if (!currentUser) {
    redirect(`/${locale}/login`)
  }

  // 🔹 2. Проверка доступа: только админ или сам юзер
  const isSelf = currentUser.id === id
  const isAdmin = currentUser.roles?.includes('admin')
  
  if (!isSelf && !isAdmin) {
    redirect(`/${locale}/cabinet/profile`)
  }

  // 🔹 3. Загружаем справочники
  const branches = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${locale}`)
    .then(r => r.json())
    .then(data => data.map((b: any) => ({
      id: b.id,
      name: b.translations?.[locale]?.name ?? b.translations?.ru?.name ?? '',
    })))
    .catch(() => [])

  const lawOffices = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices?lang=${locale}`)
    .then(r => r.json())
    .then(data => data.map((l: any) => ({
      id: l.id,
      name: l.translations?.[locale]?.name ?? l.translations?.ru?.name ?? '',
    })))
    .catch(() => [])

  const rolesOptions = [
    { value: 'guest', label: 'Гость' },
    { value: 'lawyer', label: 'Адвокат' },
    { value: 'accountant', label: 'Бухгалтер' },
    { value: 'admin', label: 'Админ' },
    { value: 'branch_head', label: 'Заведующий филиалом' },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isSelf 
          ? t.cabinet?.editProfile ?? 'Редактирование профиля' 
          : t.users?.editTitle ?? 'Редактирование пользователя'}
      </h1>
      <EditUserForm
        userId={id}
        currentUserId={currentUser.id}  // ← теперь точно string
        currentUserRoles={currentUser.roles ?? []} // ← защита от undefined
        mode={isSelf ? 'self' : 'admin'}
        t={t}
        branches={branches}
        lawOffices={lawOffices}
        rolesOptions={rolesOptions}
      />
    </div>
  )
}
