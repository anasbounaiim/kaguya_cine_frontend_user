import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import api from '@/utils/apiFetch';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/login', body);

    const { token, ...userData } = response;
    if (!token) throw new Error("Pas de token reçu !");

    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    const res = NextResponse.json({ ...userData, authenticated: true });

    res.headers.set('Set-Cookie', cookie);

    return res;
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
