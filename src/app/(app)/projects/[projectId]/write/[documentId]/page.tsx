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

  return (
    <WritingEditor
      projectId={projectId}
      document={document}
      initialChapterId={chapter ?? document.chapters[0]?.id}
    />
  );
}
