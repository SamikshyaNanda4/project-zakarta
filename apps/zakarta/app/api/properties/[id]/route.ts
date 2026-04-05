import { type NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/env";

// GET /api/properties/:id → Hono GET /properties/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const upstream = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
