import { listDocuments } from "@/lib/actions/documents";
import { NewDocumentInline } from "@/components/NewDocumentInline";

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
    <div className="px-10 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Your writing</h2>
        <NewDocumentInline projectId={projectId} />
      </div>

      {documents.length === 0 ? (
        <div className="text-center text-ink-soft py-24">
          <p className="font-display text-xl mb-2">Nothing written yet.</p>
          <p className="text-sm">Start a document whenever you&apos;re ready.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={`/projects/${projectId}/write/${doc.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <p className="font-display text-lg">{doc.title}</p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {doc.chapters.length} {doc.chapters.length === 1 ? "chapter" : "chapters"}
                </p>
              </div>
              <span className="text-xs text-ink-soft">{wordsOf(doc)} words</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
