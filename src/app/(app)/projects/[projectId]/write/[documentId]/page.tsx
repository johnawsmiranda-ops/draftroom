import { redirect } from "next/navigation";
import { getDocumentWithChapters } from "@/lib/actions/documents";
import { WritingEditor } from "@/components/WritingEditor";

export default async function DocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; documentId: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { projectId, documentId } = await params;
  const { chapter } = await searchParams;
  const document = await getDocumentWithChapters(documentId);

  // No chapter named — resume the one edited most recently rather than
  // stopping at a table of contents. The Spine is a place you choose to go
  // (the "Contents" button in the editor), not a gate on the way to writing.
  if (!chapter) {
    const mostRecent = [...document.chapters].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];

    if (mostRecent) {
      redirect(`/projects/${projectId}/write/${documentId}?chapter=${mostRecent.id}`);
    }
    // A document with no chapters at all — the Spine is the only thing to show.
    redirect(`/projects/${projectId}/write/${documentId}/contents`);
  }

  return <WritingEditor projectId={projectId} document={document} initialChapterId={chapter} />;
}
