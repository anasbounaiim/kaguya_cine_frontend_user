import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import apiCatalog from "@/utils/catalogApiFetch";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const pageParam = searchParams.get("page");
    const page = !pageParam || isNaN(+pageParam) ? 0 : parseInt(pageParam, 10);
    const size = searchParams.get("size") || "10";

    const params: Record<string, string | number> = {
      page,
      size,
      sortBy: "releaseDate",
      direction: "desc",
    };

    if (search) {
      params.title = search;
    }

    const response = await apiCatalog.get("/movies", params, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("❌ Erreur serveur:", err);
    return NextResponse.json({ message: "Erreur serveur!" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("token")?.value;

  if (!jwt) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await apiCatalog.post("/movies", body, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error("❌ POST /movies failed:", err);
    return NextResponse.json({ message: "Erreur serveur!" }, { status: 500 });
  }
}
