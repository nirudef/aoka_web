// app/[lang]/cabinet/categories/[id]/edit/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import CategoryForm from '../../CategoryForm'

// app/[lang]/cabinet/categories/[id]/edit/page.tsx
// ← Убираем логику 'new'
export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>  // id — всегда UUID
}) {
  const { lang, id } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user?.roles?.includes('admin')) {
    redirect(`/${lang}/cabinet/profile`)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}?lang=${lang}`)
  if (!res.ok) redirect(`/${lang}/cabinet/categories`)

  const category = await res.json()

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {t.cabinet?.categories?.edit ?? 'Редактирование категории'}
      </h1>
      <CategoryForm category={category} lang={lang} t={t} />
    </div>
  )
}
