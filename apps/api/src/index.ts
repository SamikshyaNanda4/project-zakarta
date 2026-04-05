import { serve } from "@hono/node-server";
import { APP_NAME } from "@repo/shared";
import app from "./app";

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`${APP_NAME} server running at http://localhost:${info.port}`);
  console.log(`API docs available at http://localhost:${info.port}/docs`);
});
