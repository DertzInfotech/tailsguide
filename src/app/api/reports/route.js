export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE || "http://144.126.252.50:8084"}/api/v1/pet/all?page=0&size=10`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch reports" }),
      { status: 500 }
    );
  }
}
