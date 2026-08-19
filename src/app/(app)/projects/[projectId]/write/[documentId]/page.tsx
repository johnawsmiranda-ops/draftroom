import { getDocumentWithChapters } from "@/lib/actions/documents";
import { WritingEditor } from "@/components/WritingEditor";
import { ManuscriptSpine } from "@/components/ManuscriptSpine";

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

  // No chapter selected yet — show the Spine (table of contents) so the
  // person can see, rename, and reorder every chapter before diving into
  // one. Picking a chapter there links here again with ?chapter=.
  if (!chapter) {
    return <ManuscriptSpine projectId={projectId} document={document} />;
  }

  return <WritingEditor projectId={projectId} document={document} initialChapterId={chapter} />;
}
