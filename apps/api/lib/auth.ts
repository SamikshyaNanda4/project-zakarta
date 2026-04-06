import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { db } from "../src/db/db"; // drizzle instance not pg instance
import * as schema from "../src/db/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      allowedToPost: {
        type: "boolean",
        defaultValue: true,
        required: true,
        input: true,
      },
    },
  },
  // Allow requests from the Next.js frontend
  trustedOrigins: ["http://localhost:3000"],
  plugins: [openAPI()],
  session: {
    expiresIn: 30 * 24 * 60 * 60 * 6, //approx 12 months
  },
});

export type Session = typeof auth.$Infer.Session;
