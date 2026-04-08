/**
 * Properties + Localities resource — client components only.
 * Hits the Hono API directly via the axios http client.
 */

import { http } from "../http";
import type {
  PropertyPublic,
  PropertyListResponse,
  ContactResponse,
  CreatePropertyBody,
  LocalityListResponse,
} from "../types";

export const properties = {
  /** GET /properties */
  list(params?: {
    listingType?: "sell" | "rent";
    area?: string;
    localityId?: string;
    /** Comma-separated locality IDs (up to 5) */
    localityIds?: string;
    bhk?: string;
    homeType?: string;
    priceMin?: number;
    priceMax?: number;
    builtUpAreaMin?: number;
    builtUpAreaMax?: number;
    furnished?: string;
    parking?: string;
    propertyAge?: string;
    bathrooms?: number;
    featured?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PropertyListResponse> {
    const query = new URLSearchParams();
    if (params?.listingType) query.set("listingType", params.listingType);
    if (params?.area) query.set("area", params.area);
    if (params?.localityId) query.set("localityId", params.localityId);
    if (params?.localityIds) query.set("localityIds", params.localityIds);
    if (params?.bhk) query.set("bhk", params.bhk);
    if (params?.homeType) query.set("homeType", params.homeType);
    if (params?.priceMin != null) query.set("priceMin", String(params.priceMin));
    if (params?.priceMax != null) query.set("priceMax", String(params.priceMax));
    if (params?.builtUpAreaMin != null) query.set("builtUpAreaMin", String(params.builtUpAreaMin));
    if (params?.builtUpAreaMax != null) query.set("builtUpAreaMax", String(params.builtUpAreaMax));
    if (params?.furnished) query.set("furnished", params.furnished);
    if (params?.parking) query.set("parking", params.parking);
    if (params?.propertyAge) query.set("propertyAge", params.propertyAge);
    if (params?.bathrooms != null) query.set("bathrooms", String(params.bathrooms));
    if (params?.featured != null) query.set("featured", String(params.featured));
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    const qs = query.toString();
    return http.GET<PropertyListResponse>(`/properties${qs ? `?${qs}` : ""}`);
  },

  /** GET /properties/:id */
  find(id: string): Promise<PropertyPublic> {
    return http.GET<PropertyPublic>(`/properties/${id}`);
  },

  /** POST /properties/:id/contact */
  getContact(id: string): Promise<ContactResponse> {
    return http.POST<ContactResponse>(`/properties/${id}/contact`);
  },

  /** POST /properties */
  create(body: CreatePropertyBody): Promise<PropertyPublic> {
    return http.POST<PropertyPublic>("/properties", body);
  },
};

export const localities = {
  /** GET /localities?area= */
  list(area: "Bhubaneswar" | "Cuttack" | "Puri"): Promise<LocalityListResponse> {
    return http.GET<LocalityListResponse>(`/localities?area=${encodeURIComponent(area)}`);
  },
};
