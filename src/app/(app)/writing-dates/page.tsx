import Link from "next/link";
import { listWritingDates } from "@/lib/actions/writing-dates";
import { listProjects } from "@/lib/actions/projects";
import { NewWritingDateForm } from "@/components/NewWritingDateForm";

export default async function WritingDatesPage() {
  const [dates, projects] = await Promise.all([listWritingDates(), listProjects()]);
  const upcoming = dates.filter((d) => !d.completedAt);
  const past = dates.filter((d) => d.completedAt);

  return (
    <main className="px-4 sm:px-10 py-12 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-2">Writing Dates</h1>
      <p className="text-ink-soft text-sm mb-10">
        Set a time to come back. When it arrives, we&apos;ll show you what you left behind.
      </p>

      <div className="rounded-2xl border border-line bg-card p-5 mb-10">
        <NewWritingDateForm projects={projects} />
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-3 mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft">Upcoming</h2>
          {upcoming.map((d) => (
            <Link
              key={d.id}
              href={`/writing-dates/${d.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <p className="font-display text-lg">{d.project.title}</p>
                <p className="text-xs text-ink-soft">{d.note}</p>
              </div>
              <div className="text-right text-sm">
                <p>{new Date(d.scheduledFor).toLocaleDateString([], { weekday: "long" })}</p>
                <p className="text-ink-soft text-xs">
                  {new Date(d.scheduledFor).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3 opacity-70">
          <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft">Past</h2>
          {past.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-line px-5 py-3 text-sm">
              <span>{d.project.title}</span>
              <span className="text-ink-soft text-xs">
                {new Date(d.scheduledFor).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {dates.length === 0 && (
        <p className="text-center text-ink-soft py-16">No writing dates yet — set one above.</p>
      )}
    </main>
  );
}
