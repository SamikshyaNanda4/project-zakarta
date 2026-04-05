import { type NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

// GET /api/properties → Hono GET /properties
export async function GET() {
  const upstream = await fetch(`${API_URL}/properties`, {
    cache: "no-store",
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

// POST /api/properties → Hono POST /properties (auth + allowedToPost)
export async function POST(req: NextRequest) {
  const body = await req.text();

  const upstream = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Forward auth cookies so better-auth can validate the session
      cookie: req.headers.get("cookie") ?? "",
    },
    body,
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
