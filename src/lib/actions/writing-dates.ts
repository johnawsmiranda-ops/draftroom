"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function listWritingDates() {
  const user = await requireUser();
  return prisma.writingDate.findMany({
    where: { userId: user.id },
    orderBy: { scheduledFor: "asc" },
    include: { project: { select: { title: true } } },
  });
}

export async function listProjectWritingDates(projectId: string) {
  const user = await requireUser();
  return prisma.writingDate.findMany({
    where: { userId: user.id, projectId },
    orderBy: { scheduledFor: "asc" },
  });
}

export async function createWritingDateAction(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const scheduledFor = String(formData.get("scheduledFor") ?? "");
  const note = String(formData.get("note") ?? "") || null;
  if (!projectId || !scheduledFor) return;

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return;

  await prisma.writingDate.create({
    data: {
      userId: user.id,
      projectId,
      scheduledFor: new Date(scheduledFor),
      note,
    },
  });

  revalidatePath("/writing-dates");
  revalidatePath(`/projects/${projectId}/writing-dates`);
}

export async function getWritingDate(id: string) {
  const user = await requireUser();
  const wd = await prisma.writingDate.findFirst({
    where: { id, userId: user.id },
    include: { project: true },
  });
  if (!wd) redirect("/writing-dates");
  return wd;
}

export async function markWritingDateVisitedAction(id: string) {
  const user = await requireUser();
  await prisma.writingDate.updateMany({
    where: { id, userId: user.id },
    data: { completedAt: new Date() },
  });
  revalidatePath("/writing-dates");
}

export async function deleteWritingDateAction(id: string) {
  const user = await requireUser();
  await prisma.writingDate.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/writing-dates");
}
