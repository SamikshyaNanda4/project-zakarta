/**
 * Axios HTTP client factory.
 *
 * createHttpClient(baseURL) returns an object with typed GET / POST / PUT /
 * PATCH / DELETE helpers.  Responses are unwrapped to `r.data` so callers
 * get the typed payload directly — no `.data` property needed.
 *
 * On non-2xx, the interceptor extracts the server's `error` message (if
 * present in the response body) so that `err.message` in catch blocks is
 * always human-readable.
 */

import axios, {
  type AxiosRequestConfig,
  isAxiosError,
} from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function createHttpClient(baseURL: string) {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // forward cookies on every request
  });

  // Unwrap server error messages so catch blocks get readable strings
  instance.interceptors.response.use(
    (response) => response,
    (err: unknown) => {
      if (isAxiosError(err) && err.response) {
        const body = err.response.data as { error?: string } | undefined;
        const message = body?.error ?? err.message ?? "Request failed";
        return Promise.reject(new Error(message));
      }
      return Promise.reject(err);
    }
  );

  return {
    GET<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
      return instance.get<T>(path, config).then((r) => r.data);
    },

    POST<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
      return instance.post<T>(path, body, config).then((r) => r.data);
    },

    PUT<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
      return instance.put<T>(path, body, config).then((r) => r.data);
    },

    PATCH<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
      return instance.patch<T>(path, body, config).then((r) => r.data);
    },

    DELETE<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
      return instance.delete<T>(path, config).then((r) => r.data);
    },
  };
}

/**
 * Axios client for client components — hits the Hono API directly.
 * withCredentials: true ensures session cookies are sent.
 */
export const http = createHttpClient(API_URL);
