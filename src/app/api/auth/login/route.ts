// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign_in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const token = data.token;
  const maxAge = 60 * 60 * 24 * 30; // 30 дней — подбери сам
  const cookieValue = `authToken=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  // const cookieValue = `authToken=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=None; Secure; Domain=.aoka.kz`;
  console.log(cookieValue);

  return new NextResponse(JSON.stringify({ ok: true, user: data.user }), {
    status: 200,
    headers: {
      'Set-Cookie': cookieValue,
      'Content-Type': 'application/json'
    }
  });
}
