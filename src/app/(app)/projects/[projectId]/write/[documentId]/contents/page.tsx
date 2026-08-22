import { getDocumentWithChapters } from "@/lib/actions/documents";
import { ManuscriptSpine } from "@/components/ManuscriptSpine";

/**
 * The Spine — a table of contents for one manuscript, where chapters get
 * renamed and reordered. Reached deliberately from the editor rather than
 * sitting between someone and their writing.
 */
export default async function ContentsPage({
  params,
}: {
  params: Promise<{ projectId: string; documentId: string }>;
}) {
  const { projectId, documentId } = await params;
  const document = await getDocumentWithChapters(documentId);

  return <ManuscriptSpine projectId={projectId} document={document} />;
}
