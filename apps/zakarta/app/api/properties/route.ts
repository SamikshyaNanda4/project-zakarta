import { type NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { serverHttp } from "@/api/server";
import type { PropertyListResponse } from "@/api";

// GET /api/properties → Hono GET /properties
export async function GET() {
  try {
    const data = await serverHttp.GET<PropertyListResponse>("/properties");
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/properties → Hono POST /properties (auth + allowedToPost)
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const data = await serverHttp.POST("/properties", body, {
      headers: {
        // Forward auth cookies so better-auth can validate the session
        cookie: req.headers.get("cookie") ?? "",
      },
    });
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
