import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe NextAuth instance (no Prisma, no bcrypt) — this is what
// middleware.ts imports from, so it stays small enough for Vercel's
// Edge Function size limit.
export const { auth } = NextAuth(authConfig);
