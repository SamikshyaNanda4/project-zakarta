import { OpenAPIHono } from "@hono/zod-openapi";
import { HealthRoutes } from "./health/handler";
import { UserRoutes } from "./users/handler";
import { PropertyRoutes } from "./properties/handler";

export function registerRoutes(app: OpenAPIHono) {
  HealthRoutes(app);
  UserRoutes(app);
  PropertyRoutes(app);
}
