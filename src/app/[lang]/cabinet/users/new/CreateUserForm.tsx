// 'use client'

// import { useState } from 'react'

// interface Branch {
//   id: string
//   name: string
// }

// interface LawOffice {
//   id: string
//   name: string
// }

// interface RoleOption {
//   value: string
//   label: string
// }

// interface Props {
//   branches: Branch[]
//   lawOffices: LawOffice[]
//   rolesOptions: RoleOption[]
// }

// export default function CreateUserForm({ branches, lawOffices, rolesOptions }: Props) {
//   const [firstName, setFirstName] = useState('')
//   const [lastName, setLastName] = useState('')
//   const [middleName, setMiddleName] = useState('')
//   const [iin, setIin] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [licenseNumber, setLicenseNumber] = useState('')
//   const [licenseIssuedAt, setLicenseIssuedAt] = useState('')
//   const [joinedAt, setJoinedAt] = useState('')
//   const [branchId, setBranchId] = useState<string | null>(null)
//   const [lawOfficeId, setLawOfficeId] = useState<string | null>(null)
//   const [address, setAddress] = useState('')
//   const [roles, setRoles] = useState<string[]>([])
//   const [error, setError] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     // Генерируем пароль, если не введён
//     // const finalPassword = password || Math.random().toString(36).slice(-12)
//     const finalPassword =
//       password ||
//       Array.from(crypto.getRandomValues(new Uint8Array(12)))
//         .map(b => (b % 36).toString(36))
//         .join('');

//     const payload = {
//       first_name: firstName,
//       last_name: lastName,
//       middle_name: middleName || null,
//       iin,
//       phone,
//       email,
//       password: finalPassword,
//       license_number: licenseNumber,
//       license_issued_at: licenseIssuedAt || null,
//       joined_at: joinedAt || null,
//       branch_id: branchId,
//       law_office_id: lawOfficeId,
//       address: branchId || lawOfficeId ? null : address,
//       roles,
//     }

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     })

//     if (res.ok) {
//       alert(`Пользователь создан. Пароль: ${finalPassword}`)
//       // Можно очистить форму
//       setFirstName('')
//       setLastName('')
//       setMiddleName('')
//       setIin('')
//       setPhone('')
//       setEmail('')
//       setPassword('')
//       setLicenseNumber('')
//       setLicenseIssuedAt('')
//       setJoinedAt('')
//       setBranchId(null)
//       setLawOfficeId(null)
//       setAddress('')
//       setRoles([])
//     } else {
//       const data = await res.json()
//       setError(data.error || 'Ошибка создания пользователя')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
//       <h2 className="text-2xl font-bold border-b pb-2 mb-4">Создание пользователя</h2>

//       {/* Персональные данные */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Персональные данные</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <input className="input" placeholder="Фамилия*" value={lastName} onChange={e => setLastName(e.target.value)} required />
//           <input className="input" placeholder="Имя*" value={firstName} onChange={e => setFirstName(e.target.value)} required />
//           <input className="input" placeholder="Отчество" value={middleName} onChange={e => setMiddleName(e.target.value)} />
//           <input className="input" placeholder="ИИН" value={iin} onChange={e => setIin(e.target.value)} />
//           <input className="input" placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} />
//           <input className="input" type="email" placeholder="Email*" value={email} onChange={e => setEmail(e.target.value)} required />
//           <input className="input" type="password" placeholder="Пароль (если оставить пустым — сгенерируется)" value={password} onChange={e => setPassword(e.target.value)} />
//         </div>
//       </section>

//       {/* Профессиональные данные */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Профессиональные данные</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <input className="input" placeholder="№ лицензии" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
//           <input className="input" type="date" placeholder="Дата выдачи лицензии" value={licenseIssuedAt} onChange={e => setLicenseIssuedAt(e.target.value)} />
//           <input className="input" type="date" placeholder="Дата вступления в Коллегию" value={joinedAt} onChange={e => setJoinedAt(e.target.value)} />
//         </div>
//       </section>

//       {/* Филиал / Контора / Адрес */}
//       <section className="space-y-4">
//         <h3 className="font-semibold text-lg">Место работы</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <select
//             className="input"
//             value={branchId || ''}
//             onChange={e => {
//               setBranchId(e.target.value || null)
//               if (e.target.value) setLawOfficeId(null)
//             }}
//           >
//             <option value="">— Филиал не выбран —</option>
//             {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//           </select>

//           <select
//             className="input"
//             value={lawOfficeId || ''}
//             onChange={e => {
//               setLawOfficeId(e.target.value || null)
//               if (e.target.value) setBranchId(null)
//             }}
//           >
//             <option value="">— Контора не выбрана —</option>
//             {lawOffices.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
//           </select>

//           {!branchId && !lawOfficeId && (
//             <input className="input" placeholder="Адрес" value={address} onChange={e => setAddress(e.target.value)} />
//           )}
//         </div>
//       </section>

//       {/* Роли */}
//       <section className="space-y-2">
//         <h3 className="font-semibold text-lg">Роли</h3>
//         <select
//           className="input"
//           multiple
//           value={roles}
//           onChange={e => setRoles(Array.from(e.target.selectedOptions, o => o.value))}
//         >
//           {rolesOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
//         </select>
//         {branchId && roles.includes('branch_head') && (
//           <p className="text-sm text-gray-500">Пользователь будет руководителем филиала</p>
//         )}
//       </section>

//       {error && <p className="text-red-500">{error}</p>}

//       <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
//         Создать пользователя
//       </button>
//     </form>
//   )
// }
