// app/[lang]/cabinet/profile/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import ProfileView from './ProfileView'

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user) redirect(`/${lang}/login`)

  // Загрузим справочники
  const [branchesRes, lawOfficesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/branches?lang=${lang}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/law_offices?lang=${lang}`),
  ])

  const branches = await branchesRes.json().then(data => 
    data.map((b: any) => ({ id: b.id, name: b.translations?.[lang]?.name ?? b.name ?? '' }))
  )

  const lawOffices = await lawOfficesRes.json().then(data => 
    data.map((l: any) => ({ id: l.id, name: l.translations?.[lang]?.name ?? l.name ?? '' }))
  )

  return <ProfileView lang={lang} user={user} t={t} branches={branches} lawOffices={lawOffices} />
}
