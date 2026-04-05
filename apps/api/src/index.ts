import { serve } from "@hono/node-server";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { APP_NAME } from "@repo/shared";

const app = new OpenAPIHono();

// --- Schema definitions ---

const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: "ok" }),
  timestamp: z.string().openapi({ example: "2026-04-05T00:00:00.000Z" }),
});

const UserParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({ param: { name: "id", in: "path" }, example: "123" }),
});

const UserResponseSchema = z.object({
  id: z.string().openapi({ example: "123" }),
  name: z.string().openapi({ example: "Jane Doe" }),
  email: z.string().email().openapi({ example: "jane@example.com" }),
});

// --- Routes ---

const healthRoute = createRoute({
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

const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  summary: "Get user by ID",
  description: "Returns a single user object for the given ID.",
  tags: ["Users"],
  request: { params: UserParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: UserResponseSchema } },
      description: "User found",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
      description: "User not found",
    },
  },
});

// --- Handlers ---

app.openapi(healthRoute, (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid("param");

  // Mock: only id "123" exists
  if (id !== "123") {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json({ id, name: "Jane Doe", email: "jane@example.com" }, 200);
});

// --- OpenAPI spec at /openapi.json ---
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Zakarta API",
    version: "0.1.0",
    description: "API documentation for the Zakarta application",
  },
});

// --- Scalar API reference UI at /docs ---
app.get(
  "/docs",
  apiReference({
    url: "/openapi.json",
    theme: "default",
  })
);

// --- Server ---
serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`${APP_NAME} server running at http://localhost:${info.port}`);
  console.log(`API docs available at http://localhost:${info.port}/docs`);
});
