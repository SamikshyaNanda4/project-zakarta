// Standalone types that don't derive from schemas

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type SortOrder = "asc" | "desc";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
