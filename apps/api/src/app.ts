import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { registerRoutes } from "./routes";

const app = new OpenAPIHono();

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
    theme: "default",
  })
);

export default app;
