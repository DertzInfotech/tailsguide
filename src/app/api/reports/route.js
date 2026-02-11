export async function GET() {
  try {
    const res = await fetch(
      "https://tailsguide-production-53f0.up.railway.app/api/v1/pet/all?page=0&size=10",
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
