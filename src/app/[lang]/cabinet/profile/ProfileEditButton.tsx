// // app/[lang]/cabinet/profile/ProfileEditButton.tsx
// 'use client'

// import { useRouter } from 'next/navigation'
// import { User } from 'lucide-react'

// export default function ProfileEditButton({ lang }: { lang: string, user: user }) {
//   const router = useRouter()

//   const handleEdit = () => {
//     router.push(`/${lang}/cabinet/users/${user.id}/edit`)
//   }

//   return (
//     <button
//       onClick={handleEdit}
//       className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition gap-2"
//     >
//       <User className="w-4 h-4" />
//       Редактировать
//     </button>
//   )
// }
