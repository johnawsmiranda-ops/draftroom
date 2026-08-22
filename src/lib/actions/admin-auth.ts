"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";

export type AdminLoginState = { error?: string } | undefined;

function envAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Sign-in for the admin panel. Uses the same account system as the writing
 * app — there is no second set of credentials — but refuses anyone without
 * an admin role and lands them in /admin rather than /home. Checking the role
 * *before* calling signIn means a non-admin never gets a session from this
 * form at all.
 */
export async function adminLoginAction(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Same generic message whether the account is missing, the password is
  // wrong, or the account simply isn't an admin — this form shouldn't reveal
  // which accounts exist or which of them are privileged.
  const generic = { error: "Those credentials don't match an admin account." };

  if (!user) return generic;
  if (user.status === "disabled") return generic;
  // Google-created accounts have no password; they must use Google sign-in.
  if (!user.passwordHash) return generic;
  if (!(await bcrypt.compare(password, user.passwordHash))) return generic;

  const isAdmin =
    user.role === "admin" || user.role === "superadmin" || envAdminEmails().includes(email);
  if (!isAdmin) return generic;

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "type" in err) return generic;
    throw err;
  }
}
