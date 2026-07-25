import { NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE || "http://144.126.252.50:8084";

/** Fast pet list for dashboard — never hang Vercel on a dead/slow backend. */
export async function GET() {
  const empty = {
    content: [],
    number: 0,
    size: 50,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  };

  try {
    const res = await fetch(
      `${BACKEND}/api/v1/pet/all?page=0&size=50&sortBy=lastSeenDate&sortDirection=desc`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
        headers: { Accept: "application/json" },
      }
    );
    if (!res.ok) {
      return NextResponse.json(empty, { status: 200 });
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(empty, { status: 200 });
  }
}
