import { createRoute } from "@hono/zod-openapi";
import { HealthResponseSchema } from "./schema";

export const healthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Health check",
  description: "Returns the health status of the API server.",
  tags: ["System"],
  responses: {
    200: {
      content: { "application/json": { schema: HealthResponseSchema } },
      description: "Server is healthy",
    },
  },
});
