import { createRoute } from "@hono/zod-openapi";
import {
  LocalityListResponseSchema,
  LocalityQuerySchema,
} from "./schema";

export const listLocalitiesRoute = createRoute({
  method: "get",
  path: "/localities",
  summary: "List localities by area",
  description: "Returns all localities for the given area (Bhubaneswar, Cuttack, or Puri).",
  tags: ["Localities"],
  request: {
    query: LocalityQuerySchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: LocalityListResponseSchema } },
      description: "Localities list",
    },
  },
});
