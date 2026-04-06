import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@repo/shared/env";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  trustedOrigins: [`http://localhost:${env.FRONTEND_PORT}`],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      allowedToPost: {
        type: "boolean",
        defaultValue: true,
        input: false,
      },
    },
  },
});
