"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

// Avatars are stored inline as base64 data URLs (no external blob storage
// wired up), so we cap the size client-side (resized to a small square
// before upload) and re-check it here in case someone bypasses the client.
const MAX_AVATAR_BYTES = 400_000;

export async function getCurrentUserProfile() {
  const user = await requireUser();
  return prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, avatarUrl: true },
  });
}

export async function updateAvatarAction(dataUrl: string) {
  const user = await requireUser();

  if (!dataUrl.startsWith("data:image/")) {
    return { ok: false, error: "That doesn't look like an image." };
  }
  if (dataUrl.length > MAX_AVATAR_BYTES) {
    return { ok: false, error: "Image is too large — try a smaller photo." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: dataUrl },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function removeAvatarAction() {
  const user = await requireUser();
  await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: null } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateNameAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Name can't be empty." };

  await prisma.user.update({ where: { id: user.id }, data: { name } });
  revalidatePath("/", "layout");
  return { ok: true };
}
