import { serve } from "@hono/node-server";
import { APP_NAME } from "@repo/shared";
import app from "./app";
import { env } from "@repo/shared/env";

const isProd = env.NODE_ENV === "production";

const BASE_URL = isProd ? env.BACKEND_URL : `http://localhost:${env.API_PORT}`;

serve({ fetch: app.fetch, port: env.API_PORT }, (info) => {
  console.log(`${APP_NAME} server running at ${BASE_URL}`);
  console.log(`API docs available at ${BASE_URL}/docs`);
  console.log(`${BASE_URL}/api/auth/reference`);
});

//hono api server properly ---- with OpenApi Integration
