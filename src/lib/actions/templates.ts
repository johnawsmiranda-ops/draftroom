"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTemplate } from "@/lib/templates";

export async function createProjectFromTemplateAction(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const templateKey = String(formData.get("templateKey") ?? "");
  if (!title) return;

  const template = getTemplate(templateKey);
  const sections = template?.includes ?? ["Chapter 1"];

  const project = await prisma.project.create({
    data: { userId: user.id, title },
  });

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      projectId: project.id,
      title,
      chapters: {
        create: sections.map((sectionTitle, index) => ({
          title: sectionTitle,
          orderIndex: index,
        })),
      },
    },
    include: { chapters: true },
  });

  revalidatePath("/home");
  redirect(`/projects/${project.id}/write/${document.id}?chapter=${document.chapters[0].id}`);
}
