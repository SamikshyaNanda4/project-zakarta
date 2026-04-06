import { type NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { serverHttp } from "@/api/server";
import type { ContactResponse } from "@/api";

// POST /api/properties/:id/contact → Hono POST /properties/:id/contact
// Requires the user to be authenticated (cookie forwarded from browser)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await serverHttp.POST<ContactResponse>(
      `/properties/${id}/contact`,
      undefined,
      {
        headers: {
          // Forward auth cookies so better-auth can validate the session
          cookie: req.headers.get("cookie") ?? "",
        },
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
