// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import api from '@/utils/apiFetch';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/register', body);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.response?.data?.message || 'Erreur serveur!' },
      { status: 500 }
    );
  }
}
