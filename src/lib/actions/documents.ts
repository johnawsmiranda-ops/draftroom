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
  // Same opt-out as project creation: skip the extra structural sections
  // (Plot, Characters, World, Timeline, etc.) when asked, and just start
  // with a single chapter instead.
  const chaptersOnly = formData.get("chaptersOnly") === "1";
  const sections = chaptersOnly ? ["Chapter 1"] : (template?.includes ?? ["Chapter 1"]);

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

export async function updateDocumentTitleAction(documentId: string, title: string) {
  const user = await requireUser();
  const trimmed = title.trim();
  if (!trimmed) return { ok: false };

  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  await prisma.document.update({ where: { id: documentId }, data: { title: trimmed } });
  revalidatePath(`/projects/${document.projectId}/write`);
  return { ok: true };
}

export async function updateChapterTitleAction(chapterId: string, documentId: string, title: string) {
  const user = await requireUser();
  const trimmed = title.trim();
  if (!trimmed) return { ok: false };

  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  await prisma.chapter.update({ where: { id: chapterId }, data: { title: trimmed } });
  revalidatePath(`/projects/${document.projectId}/write/${documentId}`);
  return { ok: true };
}

// Bulk-updates orderIndex for every chapter in a document to match the
// order the person dragged them into on the Spine (table of contents) view.
export async function reorderChaptersAction(documentId: string, orderedChapterIds: string[]) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  await prisma.$transaction(
    orderedChapterIds.map((id, index) =>
      prisma.chapter.update({ where: { id, documentId }, data: { orderIndex: index } }),
    ),
  );

  revalidatePath(`/projects/${document.projectId}/write/${documentId}`);
  return { ok: true };
}

export async function deleteChapterAction(chapterId: string, documentId: string) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return { ok: false };

  await prisma.chapter.deleteMany({ where: { id: chapterId, documentId } });
  revalidatePath(`/projects/${document.projectId}/write/${documentId}`);
  return { ok: true };
}

export async function createChapterAction(documentId: string, projectId: string) {
  const user = await requireUser();
  const document = await prisma.document.findFirst({ where: { id: documentId, userId: user.id } });
  if (!document) return;

  const existing = await prisma.chapter.findMany({
    where: { documentId },
    select: { title: true, orderIndex: true },
  });

  // Number the new chapter off the highest existing "Chapter N" title, not
  // the total chapter count -- templates (like Novel) seed non-numbered
  // chapters such as "Plot" or "Characters" alongside "Chapter 1", so
  // counting every chapter would jump straight to "Chapter 6" instead of
  // the "Chapter 2" a person actually expects next.
  const highestChapterNumber = existing.reduce((max, c) => {
    const match = /^Chapter (\d+)$/.exec(c.title);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);

  const nextOrderIndex = existing.length
    ? Math.max(...existing.map((c) => c.orderIndex)) + 1
    : 0;

  const chapter = await prisma.chapter.create({
    data: {
      documentId,
      title: `Chapter ${highestChapterNumber + 1}`,
      orderIndex: nextOrderIndex,
    },
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
