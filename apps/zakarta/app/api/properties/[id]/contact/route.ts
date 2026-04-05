import { type NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

// POST /api/properties/:id/contact → Hono POST /properties/:id/contact
// Requires the user to be authenticated (cookie forwarded from browser)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const upstream = await fetch(`${API_URL}/properties/${id}/contact`, {
    method: "POST",
    headers: {
      // Forward auth cookies so better-auth can validate the session
      cookie: req.headers.get("cookie") ?? "",
    },
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
