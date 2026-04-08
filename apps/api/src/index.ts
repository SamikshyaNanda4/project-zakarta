import { serve } from "@hono/node-server";
import { APP_NAME } from "@repo/shared";
import app from "./app";
import { env } from "@repo/shared/env";

serve({ fetch: app.fetch, port: env.API_PORT }, (info) => {
  console.log(`${APP_NAME} server running at http://localhost:${info.port}`);
  console.log(`API docs available at http://localhost:${info.port}/docs`);
  console.log(
    `API auth docs available at http://localhost:${info.port}/api/auth/reference`
  );
});

//no comments
