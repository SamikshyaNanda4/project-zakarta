import { z } from "zod";

// --- Property ---

export const PropertyListingTypeSchema = z.enum(["sell", "rent"]);
export type PropertyListingType = z.infer<typeof PropertyListingTypeSchema>;

export const CreatePropertySchema = z.object({
  name: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  listingType: PropertyListingTypeSchema,
  bhk: z.coerce
    .number()
    .int("BHK must be a whole number")
    .min(1, "BHK must be at least 1")
    .max(10, "BHK cannot exceed 10"),
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City name is too long"),
  contact: z
    .string()
    .min(6, "Contact must be at least 6 characters")
    .max(20, "Contact number is too long"),
  price: z.string().max(50, "Price description is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
});

export type CreateProperty = z.infer<typeof CreatePropertySchema>;

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
