// app/[lang]/cabinet/CabinetHeader.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Translation {
  cabinet: {
    title: string
    profile: string
    users: string
    branches: string
    offices: string
    reports: string
    newUser: string
    editUser: string
  }
}

export default function CabinetHeader({ t }: { t: Translation }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  // ✅ Маппинг путей → человекочитаемые названия
  const getTitle = (segment: string, nextSegment?: string, lang?: string) => {
    if (segment === 'cabinet') return t.cabinet.title
    if (segment === 'profile') return t.cabinet.profile
    if (segment === 'users') return t.cabinet.users
    if (segment === 'branches') return t.cabinet.branches
    if (segment === 'offices') return t.cabinet.offices
    if (segment === 'reports') return t.cabinet.reports
    if (segment === 'new' && nextSegment === 'users') return t.cabinet.newUser
    if (segment === 'edit' && segments.includes('users')) return t.cabinet.editUser
    // Динамические ID — не показываем
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
      return ''
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Формируем breadcrumbs
  const breadcrumbs = []
  let path = ''

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const nextSegment = segments[i + 1]
    path += `/${segment}`
    
    const title = getTitle(segment, nextSegment)
    if (!title) continue // пропускаем UUID, служебные части

    breadcrumbs.push({
      href: path,
      label: title,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="flex items-center hover:text-blue-700 dark:hover:text-blue-400 transition">
          <Home className="w-4 h-4 mr-1" />
          <span>АОКА</span>
        </Link>

        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 opacity-60" />
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {crumb.label}
              </span>
            ) : (
              <Link 
                href={crumb.href} 
                className="hover:text-blue-700 dark:hover:text-blue-400 transition"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
