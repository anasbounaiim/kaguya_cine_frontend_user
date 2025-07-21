import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiUser from '@/utils/usersApiFetch';

export async function GET() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const response = await apiUser.get(
      '/users/watchlist',
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

export async function POST(request: Request) {

  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;

  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await apiUser.post('/users/watchlist', body, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
