"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTemplate } from "@/lib/templates";

export async function listDocuments(projectId: string) {
  const user = await requireUser();
  return prisma.document.findMany({
    where: { projectId, userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { chapters: { select: { wordCount: true } } },
  });
}

export async function getDocumentWithChapters(documentId: string) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId: user.id },
    include: { chapters: { orderBy: { orderIndex: "asc" } } },
  });
  if (!document) redirect("/home");
  return document;
}

export async function createDocumentAction(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const title = String(formData.get("title") ?? "Untitled").trim() || "Untitled";

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return;

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      projectId,
      title,
      chapters: { create: { title: "Chapter 1", content: "", orderIndex: 0 } },
    },
    include: { chapters: true },
  });

  revalidatePath(`/projects/${projectId}/write`);
  redirect(`/projects/${projectId}/write/${document.id}?chapter=${document.chapters[0].id}`);
}

// Same as createDocumentAction, but seeds the chapter list from a named
// template (e.g. Novel → Chapter 1/Plot/Characters/World/Timeline) instead
// of a single blank "Chapter 1" — used by the new-document modal.
export async function createDocumentWithTemplateAction(formData: FormData) {
  const user = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const title = String(formData.get("title") ?? "Untitled").trim() || "Untitled";
  const templateKey = String(formData.get("templateKey") ?? "");

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return;

  const template = getTemplate(templateKey);
  const sections = template?.includes ?? ["Chapter 1"];

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      projectId,
      title,
      chapters: {
        create: sections.map((sectionTitle, index) => ({ title: sectionTitle, orderIndex: index })),
      },
    },
    include: { chapters: true },
  });

  revalidatePath(`/projects/${projectId}/write`);
  redirect(`/projects/${projectId}/write/${document.id}?chapter=${document.chapters[0].id}`);
}

export async function deleteDocumentAction(documentId: string, projectId: string) {
  const user = await requireUser();
  await prisma.document.deleteMany({ where: { id: documentId, userId: user.id } });
  revalidatePath(`/projects/${projectId}/write`);
}

export async function updateWritingFormatAction(documentId: string, format: string) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  await prisma.document.update({ where: { id: documentId }, data: { writingFormat: format } });
  return { ok: true };
}

export async function createChapterAction(documentId: string, projectId: string) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return;

  const count = await prisma.chapter.count({ where: { documentId } });
  const chapter = await prisma.chapter.create({
    data: { documentId, title: `Chapter ${count + 1}`, orderIndex: count },
  });

  revalidatePath(`/projects/${projectId}/write/${documentId}`);
  return chapter.id;
}

function countWords(html: string) {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export async function autosaveChapterAction(
  chapterId: string,
  documentId: string,
  content: string,
  title?: string,
) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  const wordCount = countWords(content);

  await prisma.chapter.update({
    where: { id: chapterId },
    data: { content, wordCount, ...(title ? { title } : {}) },
  });

  await prisma.document.update({ where: { id: documentId }, data: { updatedAt: new Date() } });

  return { ok: true, wordCount };
}
