// Types
export type {
  PropertyPublic,
  PropertyListResponse,
  ContactResponse,
  CreatePropertyBody,
  ApiError,
} from "./types";

// HTTP helpers — useful when you need raw access to GET/POST/PUT/PATCH/DELETE
export { http, createHttpClient } from "./http";

// Resource objects — use these in components
export { properties } from "./resources/properties";
