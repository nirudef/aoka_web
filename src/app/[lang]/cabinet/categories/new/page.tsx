// app/[lang]/cabinet/categories/new/page.tsx
import { redirect } from 'next/navigation'
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import CategoryForm from '../CategoryForm'

export default async function NewCategoryPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user?.roles?.includes('admin')) {
    redirect(`/${lang}/cabinet/profile`)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">
        {t.cabinet?.categories?.create ?? 'Создание категории'}
      </h1>
      <CategoryForm category={null} lang={lang} t={t} />
    </div>
  )
}
