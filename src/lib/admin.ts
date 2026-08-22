import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// A comma-separated allowlist (e.g. "me@example.com,cofounder@example.com").
// This exists so the very first admin can be granted without hand-editing the
// database — the DB `role` column is still the primary source of truth.
function envAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminUser = { id: string; email: string; name: string | null };

/**
 * Returns the signed-in user if they're an admin, otherwise null.
 * Never trusts the session alone — the role is re-read from the database on
 * every call, so revoking someone's admin access takes effect immediately
 * rather than waiting for their JWT to expire.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, status: true },
  });
  if (!user) return null;
  if (user.status === "disabled") return null;

  const isAdmin = user.role === "admin" || envAdminEmails().includes(user.email.toLowerCase());
  if (!isAdmin) return null;

  return { id: user.id, email: user.email, name: user.name };
}

/** Same as getAdminUser but redirects non-admins away instead of returning null. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/home");
  return admin;
}
