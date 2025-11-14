// app/[lang]/cabinet/layout.tsx
import { getTranslations } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/getCurrentUser'
import CabinetSidebar from './CabinetSidebar'
import CabinetHeader from './CabinetHeader'
import GlobalNotification from '@/components/GlobalNotification'

export default async function CabinetLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations(lang)
  const user = await getCurrentUser()

  if (!user) {
    // Можно редиректить, но лучше — проверка в page.tsx (чтобы layout не падал)
    return <div>Загрузка...</div>
  }

  // Загрузим справочники — только если нужны (lazy per page), но для sidebar — не нужны
  // → перенесём branches/lawOffices в конкретные страницы

  return (
    <div className="min-h-[80vh] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="max-w-7xl mx-auto">
        <CabinetHeader t={t} />
        
        <div className="flex">
          <div className="w-64 flex-shrink-0">
            <CabinetSidebar user={user} lang={lang} t={t} />
          </div>
          <div className="flex-1 ml-6">
            <GlobalNotification t={t} />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
