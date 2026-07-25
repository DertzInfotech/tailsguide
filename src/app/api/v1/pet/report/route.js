/**
 * Proxy POST /api/v1/pet/report to the backend and forward Authorization only.
 * Never forward Origin/Referer — backend CORS rejects tailsguide.com.
 */
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://144.126.252.50:8084";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const contentType = request.headers.get("content-type") || "";

    const url = `${BACKEND_BASE}/api/v1/pet/report`;
    const headers = {};
    if (authHeader) headers.Authorization = authHeader;
    if (contentType) headers["Content-Type"] = contentType;

    const body = await request.arrayBuffer();
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: body.byteLength ? body : undefined,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || res.statusText };
    }

    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("[pet/report proxy]", err);
    return Response.json(
      { businessErrorDescription: "Request failed. Please try again.", error: err.message },
      { status: 500 }
    );
  }
}
