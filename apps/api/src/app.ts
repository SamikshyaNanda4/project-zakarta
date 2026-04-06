import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { auth } from "./lib/auth";
import { registerRoutes } from "./routes";
import { cors } from "hono/cors";

const app = new OpenAPIHono();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Leading slash is required — "api/auth/**" would never match /api/auth/...
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
registerRoutes(app);
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Zakarta API",
    version: "0.1.0",
    description: "API documentation for the Zakarta application",
  },
});

app.get(
  "/docs",
  Scalar({
    url: "/openapi.json",
    theme: "deepSpace",
  })
);

export default app;
