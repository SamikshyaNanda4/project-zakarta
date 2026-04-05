import { createRoute, z } from "@hono/zod-openapi";
import {
  UserParamsSchema,
  UserResponseSchema,
  CreateUserBodySchema,
  CreateUserResponseSchema,
} from "./schema";

export const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  summary: "Create a user",
  description: "Creates a new user and returns the created user object.",
  tags: ["Users"],
  request: {
    body: {
      content: { "application/json": { schema: CreateUserBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: CreateUserResponseSchema } },
      description: "User created",
    },
  },
});

export const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  summary: "Get user by ID",
  description: "Returns a single user object for the given ID.",
  tags: ["Users"],
  request: { params: UserParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: UserResponseSchema } },
      description: "User found",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
      description: "User not found",
    },
  },
});
