import { createAuthClient } from "better-auth/react";
import { BETTER_AUTH_URL } from "./env";

export const authClient: any = createAuthClient({
  baseURL: BETTER_AUTH_URL,
});

export type AuthSession = typeof authClient.$Infer.Session;
export type AuthUser = typeof authClient.$Infer.Session.user;
