import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/current-user";

/**
 * Where "keep writing" should actually land: the chapter this person touched
 * most recently. Chapters carry `updatedAt` (bumped by autosave), so the most
 * recent one is a good proxy for "where I left off" without storing extra
 * bookkeeping.
 *
 * Pass a projectId to resume within one project, or omit it to resume across
 * everything the person is writing.
 */
export async function getResumeHref(projectId?: string): Promise<string | null> {
  const user = await getUser();
  if (!user?.id) return null;

  const chapter = await prisma.chapter.findFirst({
    where: {
      document: {
        userId: user.id,
        ...(projectId ? { projectId } : {}),
      },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      document: { select: { id: true, projectId: true } },
    },
  });

  if (!chapter) return null;
  return `/projects/${chapter.document.projectId}/write/${chapter.document.id}?chapter=${chapter.id}`;
}
