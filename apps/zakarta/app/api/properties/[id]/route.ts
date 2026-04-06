import { type NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { serverHttp } from "@/api/server";
import type { PropertyPublic } from "@/api";

// GET /api/properties/:id → Hono GET /properties/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await serverHttp.GET<PropertyPublic>(`/properties/${id}`);
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
