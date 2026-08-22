import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type AdminRole = "admin" | "superadmin";

// A comma-separated allowlist (e.g. "me@example.com,cofounder@example.com").
// Anyone listed here is treated as a SUPER admin, so the owner always has a
// way back in even if the database role were changed by mistake.
function envAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: AdminRole;
};

/**
 * Returns the signed-in user if they can reach the admin area, else null.
 * Never trusts the session alone — the role is re-read from the database on
 * every call, so revoking someone's access takes effect immediately rather
 * than waiting for their JWT to expire.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, avatarUrl: true, role: true, status: true },
  });
  if (!user) return null;
  if (user.status === "disabled") return null;

  const inEnvList = envAdminEmails().includes(user.email.toLowerCase());
  const role: AdminRole | null =
    inEnvList || user.role === "superadmin" ? "superadmin" : user.role === "admin" ? "admin" : null;
  if (!role) return null;

  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, role };
}

/** Redirects to the admin sign-in page instead of returning null. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Actions that change who has power are reserved for super admins. */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();
  if (admin.role !== "superadmin") redirect("/admin");
  return admin;
}
