/**
 * Properties resource — browser-side.
 *
 * All calls go through the Next.js BFF layer (/api/properties/*).
 *
 * Usage:
 *   import { properties } from "@/api";
 *
 *   const list   = await properties.list();
 *   const item   = await properties.find(id);
 *   const reveal = await properties.getContact(id);
 *   const newOne = await properties.create({ name, bhk, contact });
 */

import { http } from "../http";
import type {
  PropertyPublic,
  PropertyListResponse,
  ContactResponse,
  CreatePropertyBody,
} from "../types";

export const properties = {
  /** GET /api/properties — fetch all listings */
  list(): Promise<PropertyListResponse> {
    return http.GET<PropertyListResponse>("/properties");
  },

  // GET /api/properties/:id — fetch a single property
  find(id: string): Promise<PropertyPublic> {
    return http.GET<PropertyPublic>(`/properties/${id}`);
  },

  //POST /api/properties/:id/contact — reveal owner contact (auth required)
  getContact(id: string): Promise<ContactResponse> {
    return http.POST<ContactResponse>(`/properties/${id}/contact`);
  },

  // POST /api/properties — create a new listing (auth required)
  create(body: CreatePropertyBody): Promise<PropertyPublic> {
    return http.POST<PropertyPublic>("/properties", body);
  },
};
