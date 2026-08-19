import Link from "next/link";
import { getWritingDate } from "@/lib/actions/writing-dates";
import { recentGlimpses } from "@/lib/actions/glimpses";
import { ContinueButton } from "@/components/ContinueButton";

export default async function WritingDateDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wd = await getWritingDate(id);
  const glimpses = await recentGlimpses(wd.projectId, 4);

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16 bg-paper paper-texture">
      <div className="max-w-md w-full text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft mb-3">
          {wd.project.title}
        </p>
        <h1 className="font-display text-4xl mb-8">Welcome back.</h1>

        {glimpses.length > 0 && (
          <div className="text-left mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-3">
              You left these behind
            </p>
            <div className="space-y-2.5">
              {glimpses.map((g) => (
                <div key={g.id} className="rounded-xl border border-line bg-card px-4 py-3">
                  <p className="font-display text-[15px] leading-snug">{g.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <ContinueButton projectId={wd.projectId} writingDateId={wd.id} />
          <Link href="/home" className="text-xs text-ink-soft hover:text-ink">
            Maybe later
          </Link>
        </div>
      </div>
    </main>
  );
}
