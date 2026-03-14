/**
 * Proxy GET /api/v1/pet/medical/{recordId}/document to the backend and forward the Authorization header.
 * Next.js rewrites do not guarantee forwarding of headers (e.g. Bearer token), so this route ensures
 * the backend receives the token and returns the actual document (PDF) instead of an error page.
 */
const BACKEND_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://64.225.84.126:8084";

export async function GET(request, context) {
  try {
    const params = await (context.params ?? Promise.resolve({}));
    const recordId = params?.recordId;
    if (!recordId) {
      return new Response(JSON.stringify({ error: "Missing recordId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authHeader = request.headers.get("authorization");
    const url = `${BACKEND_BASE}/api/v1/pet/medical/${recordId}/document`;
    const headers = {};
    if (authHeader) headers.Authorization = authHeader;

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      let body = { error: "Document request failed." };
      try {
        if (text) body = JSON.parse(text);
      } catch {
        body = { error: text?.slice(0, 200) || `Request failed (${res.status}).` };
      }
      return new Response(JSON.stringify(body), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType);

    return new Response(blob, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[pet/medical/document proxy]", err);
    return new Response(
      JSON.stringify({ error: "Request failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
