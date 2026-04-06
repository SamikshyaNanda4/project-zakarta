export type PropertyListingType = "sell" | "rent";

export type PropertyPublic = {
  id: string;
  name: string;
  listingType: PropertyListingType;
  bhk: number;
  city: string;
  price: string | null;
  description: string | null;
  userId: string;
  createdAt: string;
};

export type PropertyListResponse = {
  properties: PropertyPublic[];
  total: number;
};

export type CreatePropertyBody = {
  name: string;
  listingType: PropertyListingType;
  bhk: number;
  city: string;
  contact: string;
  price?: string;
  description?: string;
};

