import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no bcrypt — this is what middleware imports,
// so it stays well under Vercel's Edge Function size limit. The Credentials
// provider (which needs Node APIs) is added separately in src/lib/auth.ts,
// which is only ever used in server routes/actions, not middleware.
export const authConfig = {
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
