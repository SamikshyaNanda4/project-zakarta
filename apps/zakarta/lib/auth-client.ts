import { createAuthClient } from "better-auth/react";
import { BETTER_AUTH_URL } from "./env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: any = createAuthClient({
  baseURL: BETTER_AUTH_URL,
});

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = typeof authClient.$Infer.Session.user;