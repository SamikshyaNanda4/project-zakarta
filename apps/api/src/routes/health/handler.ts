import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "./route";

export function HealthRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });
}
