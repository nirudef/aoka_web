// // app/[lang]/cabinet/UsersManager.tsx
// import { getTranslations } from '@/lib/i18n'
// import UsersTable from './users/UsersTable'
// import { fetchUsers } from './users/fetchUsers'

// export default async function UsersManager({ lang, t }: { lang: string; t: any }) {
//   // Загружаем первую страницу на сервере
//   const { users, meta } = await fetchUsers({ page: 1, lang })

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold">{t.cabinet?.usersTitle ?? 'Пользователи'}</h2>
//         <button
//           onClick={() => alert('Создание — в будущем через модалку или редирект')}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           {t.cabinet?.newUser ?? 'Создать пользователя'}
//         </button>
//       </div>

//       <UsersTable
//         initialUsers={users}
//         initialMeta={meta}
//         lang={lang}
//         t={t}
//       />
//     </div>
//   )
// }
