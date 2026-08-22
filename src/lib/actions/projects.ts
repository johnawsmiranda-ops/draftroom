"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function listProjects() {
  const user = await requireUser();
  return prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProject(projectId: string) {
  const user = await requireUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect("/home");
  return project;
}

export async function createProjectAction(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const project = await prisma.project.create({
    data: { userId: user.id, title, description: String(formData.get("description") ?? "") || null },
  });

  revalidatePath("/home");
  redirect(`/projects/${project.id}/write`);
}

export async function deleteProjectAction(projectId: string) {
  const user = await requireUser();
  await prisma.project.deleteMany({ where: { id: projectId, userId: user.id } });
  revalidatePath("/home");
  redirect("/home");
}
