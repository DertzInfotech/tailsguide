import { NextResponse } from "next/server";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE || "http://144.126.252.50:8084";

async function proxy(request, context) {
  const { path } = await context.params;
  const segments = Array.isArray(path) ? path : [path];
  const search = request.nextUrl.search || "";
  const target = `${BACKEND}/api/v1/${segments.join("/")}${search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);
  if (accept) headers.set("accept", accept);
  // Do NOT forward Origin/Referer — backend CORS rejects tailsguide.com

  const init = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = Buffer.from(await request.arrayBuffer());
  }

  try {
    const res = await fetch(target, init);
    const body = await res.arrayBuffer();
    const outHeaders = new Headers();
    const resType = res.headers.get("content-type");
    if (resType) outHeaders.set("content-type", resType);
    outHeaders.set("cache-control", "no-store");

    return new NextResponse(body, {
      status: res.status,
      headers: outHeaders,
    });
  } catch (err) {
    console.error("[api/v1 proxy]", target, err);
    return NextResponse.json(
      { error: "Backend unavailable" },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
