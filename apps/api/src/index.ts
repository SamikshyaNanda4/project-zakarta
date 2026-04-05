import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Zakarta API is running" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`API server running at http://localhost:${info.port}`);
  }
);
