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

// HTTP client (client components only)
export { http } from "./http";

// Resource objects (client components only)

export { properties, localities } from "./resources/properties";
