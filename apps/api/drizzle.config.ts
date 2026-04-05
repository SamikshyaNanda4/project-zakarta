import { defineConfig } from "drizzle-kit";
import { env } from "@repo/shared/env";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  casing: "snake_case",
});
