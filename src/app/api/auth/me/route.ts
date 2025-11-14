// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function GET() {
//   const cookieStore = cookies();
//   const token = cookieStore.get('authToken')?.value;
//   if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
//     headers: { Authorization: `Token ${token}` }
//   });
//   const data = await res.json();
//   return NextResponse.json(data, { status: res.status });
// }

// app/api/auth/me/route.ts
// import { NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// export async function GET() {
//   const cookieStore = await cookies() // <-- добавляем await
//   const token = cookieStore.get('authToken')?.value

//   if (!token) {
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
//   }

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
//     headers: { Authorization: `Token ${token}` }
//   })

//   const data = await res.json()
//   return NextResponse.json(data, { status: res.status })
// }

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {

  const cookieStore = await cookies() // <-- добавляем await
  const token = cookieStore.get('authToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
    headers: { Authorization: `Token ${token}` }
  })
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`, {
  //   // credentials: 'include', // куки автоматически пробросятся
  //   headers: { 'Content-Type': 'application/json' },
  // })

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await res.json()
  return NextResponse.json({ user })
}

