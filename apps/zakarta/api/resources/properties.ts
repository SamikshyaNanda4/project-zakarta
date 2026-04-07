/**
 * Properties + Localities resource — browser-side.
 * All calls go through the Next.js BFF layer (/api/*).
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
  /** GET /api/properties */
  list(params?: {
    listingType?: "sell" | "rent";
    area?: string;
    localityId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PropertyListResponse> {
    const query = new URLSearchParams();
    if (params?.listingType) query.set("listingType", params.listingType);
    if (params?.area) query.set("area", params.area);
    if (params?.localityId) query.set("localityId", params.localityId);
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    const qs = query.toString();
    return http.GET<PropertyListResponse>(`/properties${qs ? `?${qs}` : ""}`);
  },

  /** GET /api/properties/:id */
  find(id: string): Promise<PropertyPublic> {
    return http.GET<PropertyPublic>(`/properties/${id}`);
  },

  /** POST /api/properties/:id/contact */
  getContact(id: string): Promise<ContactResponse> {
    return http.POST<ContactResponse>(`/properties/${id}/contact`);
  },

  /** POST /api/properties */
  create(body: CreatePropertyBody): Promise<PropertyPublic> {
    return http.POST<PropertyPublic>("/properties", body);
  },
};

export const localities = {
  /** GET /api/localities?area= */
  list(area: "Bhubaneswar" | "Cuttack" | "Puri"): Promise<LocalityListResponse> {
    return http.GET<LocalityListResponse>(`/localities?area=${encodeURIComponent(area)}`);
  },
};
