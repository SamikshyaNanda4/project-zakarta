// Frontend environment variables
// NEXT_PUBLIC_* vars are inlined at build time by Next.js

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const BETTER_AUTH_URL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3001";
