import { z } from "@hono/zod-openapi";

export const LocalitySchema = z
  .object({
    id: z.string().openapi({ example: "loc_bbsr_0001" }),
    area: z.string().openapi({ example: "Bhubaneswar" }),
    name: z.string().openapi({ example: "Patia" }),
    lat: z.number().nullable().openapi({ example: 20.35 }),
    lng: z.number().nullable().openapi({ example: 85.82 }),
    perSqftRate: z.string().nullable().openapi({ example: null }),
  })
  .openapi("Locality");

export const LocalityListResponseSchema = z
  .object({
    localities: z.array(LocalitySchema),
    total: z.number().int(),
  })
  .openapi("LocalityListResponse");

export const LocalityQuerySchema = z.object({
  area: z
    .enum(["Bhubaneswar", "Cuttack", "Puri"])
    .openapi({ example: "Bhubaneswar" }),
});
