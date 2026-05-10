import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { env } from "@repo/shared/env";
import { db } from "@/db/db";
import * as schema from "@/db/schema";

const trustedOrigins =
  env.NODE_ENV === "production"
    ? [env.FRONTEND_URL]
    : [`http://localhost:${env.FRONTEND_PORT}`];

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  trustedOrigins,
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
  session: {
    expiresIn: 30 * 24 * 60 * 60 * 6, // ~6 months
  },
  plugins: [openAPI()],
  ...(env.NODE_ENV === "production" && {
    cookies: {
      domain: ".levelvein.online",
      sameSite: "none" as const,
      secure: true,
    },
  }),
});

export type Session = typeof auth.$Infer.Session;
//      sameSite: "lax" or "none" as const,
//      secure: false,
