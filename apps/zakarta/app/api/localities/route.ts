import { type NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { serverHttp } from "@/api/server";
import type { LocalityListResponse } from "@/api";

export async function GET(req: NextRequest) {
  try {
    const area = req.nextUrl.searchParams.get("area");
    if (!area) {
      return NextResponse.json({ error: "area param is required" }, { status: 400 });
    }
    const data = await serverHttp.GET<LocalityListResponse>(
      `/localities?area=${encodeURIComponent(area)}`
    );
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
