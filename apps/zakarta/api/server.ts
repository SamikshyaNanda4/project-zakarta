/**
 * Server-side HTTP client.
 *
 * Use this ONLY in:
 *   - Next.js server components (app/page.tsx, app/.../page.tsx)
 *   - Next.js route handlers (app/api/[...]/route.ts)
 *
 * It hits the Hono backend directly at API_URL (bypasses the BFF layer).
 * For proxy route handlers that need to forward browser cookies, pass them
 * via the config argument:
 *
 *   serverHttp.POST("/properties", body, {
 *     headers: { cookie: req.headers.get("cookie") ?? "" },
 *   })
 */

import { createHttpClient } from "./http";
import { API_URL } from "@/lib/env";

export const serverHttp = createHttpClient(API_URL);
