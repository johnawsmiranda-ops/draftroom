"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

export type ImportSandboxDraftResult =
  | { ok: true; projectId: string; documentId: string; chapterId: string }
  | { ok: false };

/**
 * Turns a sandbox visitor's untitled scratch draft (kept only in their
 * browser's localStorage while they were signed out) into a real first
 * project the moment they finish signing up. Mirrors the same
 * Project -> Document -> Chapter("Chapter 1") shape createDocumentAction
 * uses, so the result looks exactly like a normal manually-created project.
 */
export async function importSandboxDraftAction(
  title: string,
  content: string,
): Promise<ImportSandboxDraftResult> {
  const user = await requireUser();

  const cleanTitle = title.trim() || "My First Draft";
  const cleanContent = content ?? "";
  if (!cleanContent.trim()) return { ok: false };

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: cleanTitle,
      documents: {
        create: {
          userId: user.id,
          title: cleanTitle,
          chapters: { create: { title: "Chapter 1", content: cleanContent, orderIndex: 0 } },
        },
      },
    },
    include: { documents: { include: { chapters: true } } },
  });

  const document = project.documents[0];
  const chapter = document.chapters[0];

  revalidatePath("/home");
  return { ok: true, projectId: project.id, documentId: document.id, chapterId: chapter.id };
}
