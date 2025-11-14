// app/[lang]/cabinet/CabinetSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  User,
  Users,
  Building,
  Landmark,
  FileText,
  LogOut,
  Home,
} from 'lucide-react'

interface User {
  id: string
  roles?: string[]
}

interface Translation {
  cabinet: {
    profile: string
    users: string
    branches: string
    offices: string
    reports: string
    backToSite: string
  }
  nav: {
    logout: string
  }
}

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
  roles: string[]
}

export default function CabinetSidebar({
  user,
  lang,
  t,
}: {
  user: User
  lang: string
  t: Translation
}) {
  const pathname = usePathname()

  // ✅ Формируем меню на основе ролей
  const links: SidebarLink[] = [
    {
      href: `/${lang}/cabinet/profile`,
      label: t.cabinet.profile,
      icon: <User className="w-5 h-5" />,
      roles: ['guest', 'lawyer', 'accountant', 'admin', 'branch_head'],
    },
    ...(user.roles?.includes('admin') 
      ? [{
          href: `/${lang}/cabinet/users`,
          label: t.cabinet.users,
          icon: <Users className="w-5 h-5" />,
          roles: ['admin'],
        }] 
      : []),
    ...(user.roles?.includes('admin') || user.roles?.includes('branch_head')
      ? [{
          href: `/${lang}/cabinet/branches`,
          label: t.cabinet.branches,
          icon: <Building className="w-5 h-5" />,
          roles: ['admin', 'branch_head'],
        }] 
      : []),
    ...(user.roles?.includes('admin') || user.roles?.includes('lawyer')
      ? [{
          href: `/${lang}/cabinet/offices`,
          label: t.cabinet.offices,
          icon: <Landmark className="w-5 h-5" />,
          roles: ['admin', 'lawyer'],
        }] 
      : []),
    ...(user.roles?.includes('admin')
      ? [{
          href: `/${lang}/cabinet/articles`,
          label: 'articles',
          icon: <Landmark className="w-5 h-5" />,
          roles: ['admin'],
        }] 
      : []),
    ...(user.roles?.includes('admin')
      ? [{
          href: `/${lang}/cabinet/categories`,
          label: 'categories',
          icon: <Landmark className="w-5 h-5" />,
          roles: ['admin'],
        }] 
      : []),
    ...(user.roles?.includes('admin') || user.roles?.includes('accountant')
      ? [{
          href: `/${lang}/cabinet/reports`,
          label: t.cabinet.reports,
          icon: <FileText className="w-5 h-5" />,
          roles: ['admin', 'accountant'],
        }] 
      : []),
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t.cabinet.profile}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.id}</p>
      </div>

      <nav className="py-2">
        {links.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className={`flex items-center space-x-3 px-4 py-3 w-full text-left transition-colors ${
              pathname === link.href
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className={`${pathname === link.href ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
              {link.icon}
            </span>
            <span className="font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span>{t.cabinet.backToSite}</span>
        </Link>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 dark:text-red-400" />
            <span className="text-red-600 group-hover:text-red-700 dark:text-red-400">{t.nav.logout}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
