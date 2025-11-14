// 'use client'

// import { useState } from 'react'
// import EditUserForm from './users/[id]/edit/EditUserForm' // ← убедись в правильном пути
// import type { CurrentUser } from '@/lib/types'
// import UsersManager from './UsersManager';

// interface Branch { id: string; name: string }
// interface LawOffice { id: string; name: string }
// interface RoleOption { value: string; label: string }

// interface Props {
//   user: CurrentUser
//   lang: string
//   t: any
//   branches: Branch[]
//   lawOffices: LawOffice[]
//   rolesOptions: RoleOption[]
// }

// export default function CabinetTabs({ user, lang, t, branches, lawOffices, rolesOptions }: Props) {
//   const [activeTab, setActiveTab] = useState('personal')
//   const [editing, setEditing] = useState(false)

//   const isAdmin = user?.roles?.includes('admin')
//   const isLawyer = user?.roles?.includes('lawyer')

//   const handleAfterSave = (isSelf: boolean) => {
//     if (isSelf) {
//       setEditing(false) // ← закрываем форму, показываем профиль
//     }
//     // Для админа — можно оставить форму открытой или перейти в список
//   }

//   const tabs = []
//   if (isLawyer || isAdmin) tabs.push({ key: 'personal', label: t.cabinet?.fields.name || 'Личные данные' })
//   if (isAdmin) tabs.push({ key: 'users', label: t.cabinet?.manageUsers || 'Пользователи' })

//   return (
//     <div className="flex w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow">
//       <div className="w-48 border-r border-gray-200 dark:border-gray-700 flex flex-col">
//         {tabs.map(tab => (
//           <button
//             key={tab.key}
//             className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
//               activeTab === tab.key ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
//             }`}
//             onClick={() => {
//               setActiveTab(tab.key)
//               setEditing(false)
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       <div className="flex-1 p-6 space-y-4">
//         {activeTab === 'personal' && user && (
//           <>
//             {!editing ? (
//               <div className="space-y-2 text-sm sm:text-base">
//                 <p><strong>{t.cabinet.fields.id}:</strong> {user.id}</p>
//                 <p><strong>{t.cabinet.fields.email}:</strong> {user.email}</p>
//                 {user.first_name && (
//                   <p><strong>{t.cabinet.fields.name}:</strong> {user.last_name} {user.first_name} {user.middle_name ?? ''}</p>
//                 )}
//                 {user.phone && <p><strong>{t.cabinet.fields.phone}:</strong> {user.phone}</p>}
//                 <p>
//                   <strong>{t.cabinet.fields.status}:</strong>{' '}
//                   {user.verified ? (
//                     <span className="text-green-600">{t.cabinet.status.verified}</span>
//                   ) : (
//                     <span className="text-yellow-600">{t.cabinet.status.unverified}</span>
//                   )}
//                 </p>
//                 {Array.isArray(user.roles) && user.roles.length > 0 && (
//                   <p><strong>{t.cabinet.fields.roles}:</strong> {user.roles.map(r => t[`role_${r}`] || r).join(', ')}</p>
//                 )}
//                 <button
//                   className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                   onClick={() => setEditing(true)}
//                 >
//                   {t.cabinet.editProfile}
//                 </button>
//               </div>
//             ) : (
//               <EditUserForm
//                 t={t}
//                 mode="self"
//                 userId={user.id}
//                 currentUserRoles={user.roles}
//                 branches={branches}
//                 lawOffices={lawOffices}
//                 rolesOptions={rolesOptions}
//                 onAfterSave={handleAfterSave}
//               />
//             )}
//           </>
//         )}

//         {activeTab === 'users' && isAdmin && (
//           // <div className="p-2">
//           //   <UsersManager
//           //     lang={lang}
//           //     t={t}
//           //     branches={branches}
//           //     lawOffices={lawOffices}
//           //     rolesOptions={rolesOptions}
//           //   />
//           // </div>
//           <div>
//             <iframe
//               src={`/${lang}/cabinet/users`}
//               className="w-full h-[600px] border border-gray-300 dark:border-gray-700 rounded"
//               title="Управление пользователями"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
