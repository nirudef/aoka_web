// import { getTranslations } from '@/lib/i18n'
import Link from 'next/link'
// import DeleteUserButton from './DeleteUserButton'

// export default async function UsersPage({ params }: { params: Promise<{ lang: string }> }) {
//   const { lang } = await params
//   const t = await getTranslations(lang)

//   // Загружаем пользователей с бэкенда
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
//     next: { revalidate: 0 }, // не кэшировать
//   })

//   if (!res.ok) {
//     console.error('Ошибка загрузки пользователей:', res.status)
//     throw new Error('Не удалось загрузить пользователей')
//   }

//   const users = await res.json()

//   const roleLabels: Record<string, string> = {
//     lawyer: 'Адвокат',
//     accountant: 'Бухгалтер',
//     branch_head: 'Заведующий филиалом',
//     admin: 'Администратор',
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-6 py-10">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold">
//           {t.cabinet?.usersTitle ?? 'Пользователи'}
//         </h1>
//         <Link
//           href={`/${lang}/cabinet/users/new`}
//           className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//         >
//           {t.cabinet?.newUser ?? 'Создать пользователя'}
//         </Link>
//       </div>

//       <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-gray-50 border-b text-left">
//             <tr>
//               <th className="px-4 py-2 font-medium text-gray-600">ФИО</th>
//               <th className="px-4 py-2 font-medium text-gray-600">Email</th>
//               <th className="px-4 py-2 font-medium text-gray-600">Филиал</th>
//               <th className="px-4 py-2 font-medium text-gray-600">Роли</th>
//               <th className="px-4 py-2 text-right font-medium text-gray-600">
//                 Действия
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u: any) => (
//               <tr key={u.id} className="border-b hover:bg-gray-50">
//                 <td className="px-4 py-2">
//                   {[u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ')}
//                 </td>
//                 <td className="px-4 py-2">{u.email}</td>
//                 <td className="px-4 py-2">{u.branch?.translations?.ru?.name || '—'}</td>
//                 <td className="px-4 py-2">
//                   <div className="flex flex-wrap gap-1">
//                     {u.roles.map((r: string, i: number) => (
//                       <span
//                         key={i}
//                         className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800 border border-blue-200"
//                       >
//                         {roleLabels[r] ?? r}
//                       </span>
//                     ))}
//                   </div>
//                 </td>
//                 <td className="px-4 py-2 text-right">
//                   <Link
//                     href={`/${lang}/cabinet/users/${u.id}/edit`}
//                     className="text-blue-600 hover:underline"
//                   >
//                     Редактировать
//                   </Link>
//                   <DeleteUserButton userId={u.id} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   )
// }

import { getTranslations } from '@/lib/i18n'
import UsersTable from './UsersTable'

export default async function UsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)

  // Загружаем первую страницу пользователей
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?page=1`, { next: { revalidate: 0 } })
  const data = await res.json()

  return (
    <main className="max-w-6xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t.cabinet?.usersTitle ?? 'Пользователи'}</h1>
        <Link href={`/${lang}/cabinet/users/new`} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          {t.cabinet?.newUser ?? 'Создать пользователя'}
        </Link>
      </div>

      <UsersTable t={t} initialUsers={data.users} initialMeta={data.meta} lang={lang} />
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getTranslations(lang)

  // Например, для /cabinet/users:
  return {
    title: `${t.cabinet.users} — ${t.cabinet.title} | АОКА`,
  }
}