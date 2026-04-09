import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import {
  PropertyParamsSchema,
  PropertyPublicSchema,
  PropertyListResponseSchema,
  CreatePropertyBodySchema,
  CreatePropertyResponseSchema,
  ContactResponseSchema,
  ErrorSchema,
} from "./schema";

export const listPropertiesRoute = createRoute({
  method: "get",
  path: "/properties",
  summary: "List all properties",
  description: "Returns properties with basic info (contact hidden).",
  tags: ["Properties"],
  request: {
    query: z.object({
      listingType: z
        .enum(["sell", "rent"])
        .optional()
        .openapi({ example: "sell" }),
      area: z.string().optional().openapi({ example: "Bhubaneswar" }),
      localityId: z.string().optional(),
      // Comma-separated locality IDs (up to 5 values are there)
      localityIds: z.string().optional().openapi({ example: "loc_1,loc_2" }),
      bhk: z.string().optional().openapi({ example: "2" }),
      homeType: z.string().optional(),
      priceMin: z.coerce.number().optional(),
      priceMax: z.coerce.number().optional(),
      builtUpAreaMin: z.coerce.number().optional(),
      builtUpAreaMax: z.coerce.number().optional(),
      furnished: z.string().optional(),
      parking: z.string().optional(),
      propertyAge: z.string().optional(),
      bathrooms: z.coerce.number().int().optional(),
      featured: z.enum(["true", "false"]).optional(),
      page: z.coerce.number().int().min(1).default(1).optional(),
      pageSize: z.coerce.number().int().min(1).max(50).default(20).optional(),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: PropertyListResponseSchema } },
      description: "List of properties",
    },
  },
});

export const getPropertyRoute = createRoute({
  method: "get",
  path: "/properties/{id}",
  summary: "Get a property by ID",
  description: "Returns a property with all details (contact hidden).",
  tags: ["Properties"],
  request: { params: PropertyParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: PropertyPublicSchema } },
      description: "Property found",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Property not found",
    },
  },
});

export const createPropertyRoute = createRoute({
  method: "post",
  path: "/properties",
  summary: "Create a property listing",
  description:
    "Creates a new sell or rent listing. Requires auth and allowedToPost flag.",
  tags: ["Properties"],
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: CreatePropertyBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: CreatePropertyResponseSchema } },
      description: "Property created",
    },
    401: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Unauthorized",
    },
    403: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Forbidden",
    },
    422: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Locality not found",
    },
  },
});

export const getContactRoute = createRoute({
  method: "post",
  path: "/properties/{id}/contact",
  summary: "Reveal property contact",
  description:
    "Returns the owner contact for a property. Requires authentication. Revealed per-request to prevent scraping.",
  tags: ["Properties"],
  security: [{ cookieAuth: [] }],
  request: { params: PropertyParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: ContactResponseSchema } },
      description: "Contact revealed",
    },
    401: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Unauthorized",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Property not found",
    },
  },
});
