export type {
  PropertyPublic,
  PropertyListResponse,
  CreatePropertyBody,
  CreateSellPropertyBody,
  CreateRentPropertyBody,
  PropertyListingType,
  PropertyPhoto,
  SellAmenities,
  RentAmenities,
} from "./properties";
export type { ContactResponse } from "./contact";

export type ApiError = {
  error: string;
};

export type Locality = {
  id: string;
  area: string;
  name: string;
  lat: number | null;
  lng: number | null;
  perSqftRate: string | null;
};

export type LocalityListResponse = {
  localities: Locality[];
  total: number;
};
