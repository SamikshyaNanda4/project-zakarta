import { z } from "@hono/zod-openapi";

export const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  timestamp: z.string().openapi({ example: "2026-04-05T00:00:00.000Z" }),
});
