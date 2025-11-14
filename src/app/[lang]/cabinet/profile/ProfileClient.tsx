// 'use client'

// import { useEffect, useState } from 'react'

// export default function ProfileClient({ lang, t }: { lang: string; t: any }) {
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetch('/api/auth/me')
//       .then(async res => {
//         if (!res.ok) throw new Error('Не авторизован')
//         const data = await res.json()
//         setUser(data)
//       })
//       .catch(() => {
//         window.location.href = `/${lang}/login`
//       })
//       .finally(() => setLoading(false))
//   }, [lang])

//   async function handleLogout() {
//     await fetch('/api/auth/logout', { method: 'POST' })
//     window.location.href = `/${lang}/login`
//   }

//   if (loading) return <p>Загрузка...</p>

//   return (
//     <div style={{ maxWidth: 500, margin: '50px auto' }}>
//       <h1>{t.profile.title}</h1>
//       <pre>{JSON.stringify(user, null, 2)}</pre>
//       <button onClick={handleLogout}>{t.profile.logout}</button>
//     </div>
//   )
// }
