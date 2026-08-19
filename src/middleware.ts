import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Uses the Edge-safe config only — keeps this Edge Function small.
// Do not import "@/lib/auth" here (it pulls in Prisma + bcrypt and will
// blow past Vercel's Edge Function size limit).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/home", "/projects/:path*", "/writing-dates/:path*"],
};
