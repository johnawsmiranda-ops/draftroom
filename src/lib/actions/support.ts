"use server";

import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitSupportMessageAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  await prisma.supportMessage.create({ data: { name, email, subject, message } });
  return { ok: true };
}
