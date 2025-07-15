import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '@/utils/apiFetch';

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const response = await api.get(
      '/user/user-profile',
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      }
    );
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
