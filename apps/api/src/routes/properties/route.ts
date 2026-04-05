import { createRoute } from "@hono/zod-openapi";
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
  description: "Returns a paginated list of properties (contact hidden).",
  tags: ["Properties"],
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
  description: "Returns a single property without contact info.",
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
  description: "Creates a new property. Requires auth and allowedToPost flag.",
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
  },
});

export const getContactRoute = createRoute({
  method: "post",
  path: "/properties/{id}/contact",
  summary: "Reveal property contact",
  description:
    "Returns the contact number for a property. Requires authentication. Contact is revealed per-request to prevent scraping.",
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
