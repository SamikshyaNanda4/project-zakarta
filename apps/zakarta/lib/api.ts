/**
 * Thin API client for calling our own Next.js route handlers (BFF layer).
 * Route handlers forward requests to the Hono OpenAPI backend internally.
 */

export type PropertyPublic = {
  id: string;
  name: string;
  bhk: number;
  userId: string;
  createdAt: string;
};

export type PropertyListResponse = {
  properties: PropertyPublic[];
  total: number;
};

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const propertiesApi = {
  list: () => apiFetch<PropertyListResponse>("/properties"),

  get: (id: string) => apiFetch<PropertyPublic>(`/properties/${id}`),

  getContact: (id: string) =>
    apiFetch<{ contact: string }>(`/properties/${id}/contact`, {
      method: "POST",
    }),

  create: (body: { name: string; bhk: number; contact: string }) =>
    apiFetch<PropertyPublic>("/properties", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
