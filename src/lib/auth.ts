import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

// Google sign-in stays optional: without credentials configured the provider
// simply isn't offered, so local development and preview deploys keep working
// on email/password alone.
const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) return null;

        // An admin-disabled account can still hold a valid password, so the
        // status check has to happen here or disabling would do nothing.
        if (user.status === "disabled") return null;

        // Google-created accounts have no password to compare against.
        if (!user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    ...authConfig.callbacks,

    /**
     * Runs before a session is issued. For Google we upsert our own User row
     * keyed on the verified email address, so a person who first registered
     * with a password and later uses Google lands in the same account instead
     * of getting a second, empty one.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      const email = user.email?.toLowerCase();
      // Google tells us whether it has actually verified the address. Linking
      // on an unverified one would let anyone who can set that address on a
      // Google account walk into the matching Draftroom account.
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified;
      if (!email || verified === false) return false;

      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing) {
        if (existing.status === "disabled") return false;
        // Backfill only what's missing — never overwrite a name or photo the
        // person has already set inside Draftroom.
        const patch: { name?: string; avatarUrl?: string } = {};
        if (!existing.name && user.name) patch.name = user.name;
        if (!existing.avatarUrl && user.image) patch.avatarUrl = user.image;
        if (Object.keys(patch).length > 0) {
          await prisma.user.update({ where: { id: existing.id }, data: patch });
        }
        return true;
      }

      await prisma.user.create({
        data: {
          email,
          name: user.name ?? null,
          avatarUrl: user.image ?? null,
          passwordHash: null,
        },
      });
      return true;
    },

    /**
     * The default token id comes from the provider (Google's subject id for
     * OAuth), which isn't our primary key — so on first sign-in we swap in the
     * database id that the rest of the app expects.
     */
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { id: true },
        });
        if (dbUser) token.id = dbUser.id;
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
