import { env } from "@repo/shared/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 30,
  idleTimeoutMillis: 33000,
});

export const db = drizzle(pool, { schema, casing: "snake_case" });
