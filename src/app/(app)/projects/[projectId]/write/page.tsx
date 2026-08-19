import { listDocuments } from "@/lib/actions/documents";
import { NewDocumentModal } from "@/components/NewDocumentModal";
import { DocumentCard } from "@/components/DocumentCard";

function wordsOf(doc: { chapters: { wordCount: number }[] }) {
  return doc.chapters.reduce((sum, c) => sum + c.wordCount, 0);
}

export default async function WritePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const documents = await listDocuments(projectId);

  return (
    <div className="px-4 sm:px-10 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Chapters</h2>
        <NewDocumentModal projectId={projectId} />
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-ink-soft py-24">
          <p className="font-display text-xl mb-2">Nothing written yet.</p>
          <p className="text-sm">Start a document whenever you&apos;re ready.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              projectId={projectId}
              title={doc.title}
              chapterCount={doc.chapters.length}
              words={wordsOf(doc)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
