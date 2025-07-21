import apiUser from "@/utils/usersApiFetch";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('token')?.value;
  if (!jwt) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }
  try {
    await apiUser.delete(`/users/watchlist/${params.id}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    return NextResponse.json({ message: "Film deleted from favoris" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur!' },
      { status: 500 }
    );
  }
}