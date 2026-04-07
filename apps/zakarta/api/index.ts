// Types
export type {
  PropertyPublic,
  PropertyListResponse,
  ContactResponse,
  CreatePropertyBody,
  CreateSellPropertyBody,
  CreateRentPropertyBody,
  PropertyPhoto,
  SellAmenities,
  RentAmenities,
  Locality,
  LocalityListResponse,
  ApiError,
} from "./types";

// HTTP helpers
export { http, createHttpClient } from "./http";

// Resource objects
export { properties, localities } from "./resources/properties";
