import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";

/**
 * Middleware that requires a valid session.
 * Sets `user` and `session` in the Hono context for downstream handlers.
 */
export const requireAuth = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
}>(async (c, next) => {
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!sessionData) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", sessionData.user);
  c.set("session", sessionData.session);
  await next();
});

/**
 * Middleware that requires the user to have `allowedToPost = true`.
 * Must be applied AFTER `requireAuth`.
 */
export const requireAllowedToPost = createMiddleware<{
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
}>(async (c, next) => {
  const user = c.get("user") as typeof auth.$Infer.Session.user & {
    allowedToPost?: boolean;
  };

  if (!user?.allowedToPost) {
    return c.json(
      { error: "Forbidden: you are not allowed to post listings" },
      403
    );
  }

  await next();
});
