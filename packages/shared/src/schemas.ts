import { z } from "zod";

// --- User ---

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export const UserParamsSchema = z.object({
  id: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;

// --- Pagination ---

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// --- API responses ---

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export function apiSuccess<T>(data: T) {
  return { success: true as const, data };
}

export function apiError(message: string, code?: string) {
  return { success: false as const, error: { message, code } };
}
