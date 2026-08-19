"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

const STICKY_COLORS = ["peach", "sage", "blush", "cream", "lav"] as const;

function randomColor() {
  return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
}

function randomTilt() {
  return Math.round((Math.random() * 6 - 3) * 10) / 10;
}

export async function listGlimpses(projectId: string) {
  const user = await requireUser();
  return prisma.glimpse.findMany({
    where: { projectId, userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function recentGlimpses(projectId: string, take = 3) {
  const user = await requireUser();
  return prisma.glimpse.findMany({
    where: { projectId, userId: user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function createGlimpseAction(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const type = (String(formData.get("type") ?? "text") as "text" | "voice") || "text";
  const transcript = String(formData.get("transcript") ?? "") || null;
  const pinned = formData.get("pinned") === "true";

  if (!content && !transcript) return;

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return;

  await prisma.glimpse.create({
    data: {
      userId: user.id,
      projectId,
      type,
      content: content || transcript || "",
      transcript: type === "voice" ? transcript : null,
      color: randomColor(),
      rotation: randomTilt(),
      pinned,
    },
  });

  revalidatePath(`/projects/${projectId}/glimpses`);
}

export async function togglePinAction(glimpseId: string, projectId: string) {
  const user = await requireUser();
  const glimpse = await prisma.glimpse.findFirst({ where: { id: glimpseId, userId: user.id } });
  if (!glimpse) return;
  await prisma.glimpse.update({ where: { id: glimpseId }, data: { pinned: !glimpse.pinned } });
  revalidatePath(`/projects/${projectId}/glimpses`);
}

export async function updateGlimpsePosition(
  glimpseId: string,
  projectId: string,
  positionX: number,
  positionY: number,
) {
  const user = await requireUser();
  await prisma.glimpse.updateMany({
    where: { id: glimpseId, userId: user.id },
    data: { positionX, positionY },
  });
  revalidatePath(`/projects/${projectId}/glimpses`);
}

export async function deleteGlimpseAction(glimpseId: string, projectId: string) {
  const user = await requireUser();
  await prisma.glimpse.deleteMany({ where: { id: glimpseId, userId: user.id } });
  revalidatePath(`/projects/${projectId}/glimpses`);
}

export async function updateGlimpseContentAction(
  glimpseId: string,
  projectId: string,
  content: string,
) {
  const user = await requireUser();
  await prisma.glimpse.updateMany({
    where: { id: glimpseId, userId: user.id },
    data: { content },
  });
  revalidatePath(`/projects/${projectId}/glimpses`);
}
