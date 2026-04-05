import { OpenAPIHono } from "@hono/zod-openapi";
import { createUserRoute, getUserRoute } from "./route";

export function UserRoutes(app: OpenAPIHono) {
  // POST /users — create a new user
  app.openapi(createUserRoute, (c) => {
    const { name, email } = c.req.valid("json");

    // TODO: persist to DB — returning fake data for now
    const newUser = { id: "456", name, email };

    return c.json(newUser, 201);
  });

  // GET /users/:id — fetch a user by ID
  app.openapi(getUserRoute, (c) => {
    const { id } = c.req.valid("param");

    if (id !== "123") {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ id, name: "Jane Doe", email: "jane@example.com" }, 200);
  });
}
