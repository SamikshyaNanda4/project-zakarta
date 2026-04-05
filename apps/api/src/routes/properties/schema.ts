import { z } from "@hono/zod-openapi";

export const PropertyParamsSchema = z
  .object({ id: z.string().min(1).openapi({ example: "prop_abc123" }) })
  .openapi("PropertyParams");

export const PropertyPublicSchema = z
  .object({
    id: z.string().openapi({ example: "prop_abc123" }),
    name: z.string().openapi({ example: "Sunny 2BHK in Koramangala" }),
    bhk: z.number().int().openapi({ example: 2 }),
    userId: z.string().openapi({ example: "user_xyz" }),
    createdAt: z.string().openapi({ example: "2026-04-05T10:00:00.000Z" }),
  })
  .openapi("PropertyPublic");

export const PropertyListResponseSchema = z
  .object({
    properties: z.array(PropertyPublicSchema),
    total: z.number().int(),
  })
  .openapi("PropertyListResponse");

export const CreatePropertyBodySchema = z
  .object({
    name: z
      .string()
      .min(3)
      .openapi({ example: "Sunny 2BHK in Koramangala" }),
    bhk: z.number().int().min(1).max(10).openapi({ example: 2 }),
    contact: z.string().min(6).openapi({ example: "+91 98765 43210" }),
  })
  .openapi("CreatePropertyBody");

export const CreatePropertyResponseSchema = PropertyPublicSchema.openapi(
  "CreatePropertyResponse"
);

export const ContactResponseSchema = z
  .object({
    contact: z.string().openapi({ example: "+91 98765 43210" }),
  })
  .openapi("ContactResponse");

export const ErrorSchema = z
  .object({ error: z.string() })
  .openapi("ErrorResponse");
