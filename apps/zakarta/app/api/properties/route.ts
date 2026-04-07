import { type NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { serverHttp } from "@/api/server";
import type { PropertyListResponse } from "@/api";

export async function GET(req: NextRequest) {
  try {
    const qs = req.nextUrl.searchParams.toString();
    const data = await serverHttp.GET<PropertyListResponse>(
      `/properties${qs ? `?${qs}` : ""}`
    );
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await serverHttp.POST("/properties", body, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
