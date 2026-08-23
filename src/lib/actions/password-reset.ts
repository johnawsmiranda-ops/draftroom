"use server";

import crypto from "crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export type ActionState = { error?: string; success?: string } | undefined;

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Always the same message whether or not the account exists (or has a
// password at all), so this can't be used to check which emails have
// Draftroom accounts.
const GENERIC_SUCCESS: ActionState = {
  success: "If that email has an account, a reset link is on its way.",
};

export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Enter your email address." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Google-only accounts have no password to reset — same generic response
  // either way, so this doesn't leak which case it was.
  if (!user || !user.passwordHash) return GENERIC_SUCCESS;

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://draftroom.mindcrossed.com";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your Draftroom password",
    text: `Someone asked to reset the password on your Draftroom account. If that was you, set a new one here: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
    html: `<p>Someone asked to reset the password on your Draftroom account.</p><p>If that was you, <a href="${resetUrl}">set a new password here</a>. This link expires in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
  });

  return GENERIC_SUCCESS;
}

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Use at least 8 characters"),
});

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const { token, password } = parsed.data;
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: "That reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return { success: "Your password has been reset — you can log in now." };
}
