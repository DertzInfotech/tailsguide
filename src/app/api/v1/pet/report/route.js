/**
 * Proxy POST /api/v1/pet/report to the backend and forward the Authorization header.
 * Next.js rewrites do not guarantee forwarding of headers (e.g. Bearer token) to the
 * destination, so this route ensures the backend receives the token for "register a pet".
 */
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://64.225.84.126:8084";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const contentType = request.headers.get("content-type") || "";

    const url = `${BACKEND_BASE}/api/v1/pet/report`;
    const headers = {
      ...(authHeader && { Authorization: authHeader }),
    };
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

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
      data = { message: text };
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
