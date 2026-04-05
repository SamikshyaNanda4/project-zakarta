import { z } from "@hono/zod-openapi";

export const UserParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({ param: { name: "id", in: "path" }, example: "123" }),
});

export const UserResponseSchema = z.object({
  id: z.string().openapi({ example: "123" }),
  name: z.string().openapi({ example: "Jane Doe" }),
  email: z.string().email().openapi({ example: "jane@example.com" }),
});

export const CreateUserBodySchema = z.object({
  name: z.string().min(1).openapi({ example: "John Doe" }),
  email: z.string().email().openapi({ example: "john@example.com" }),
});

export const CreateUserResponseSchema = z.object({
  id: z.string().openapi({ example: "456" }),
  name: z.string().openapi({ example: "John Doe" }),
  email: z.string().email().openapi({ example: "john@example.com" }),
});
