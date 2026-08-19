import Link from "next/link";
import { listProjectWritingDates } from "@/lib/actions/writing-dates";
import { NewWritingDateForm } from "@/components/NewWritingDateForm";
import { getProject } from "@/lib/actions/projects";

export default async function ProjectWritingDatesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [dates, project] = await Promise.all([listProjectWritingDates(projectId), getProject(projectId)]);

  return (
    <div className="px-4 sm:px-10 py-6 max-w-2xl mx-auto">
      <div className="rounded-2xl border border-line bg-card p-5 mb-8">
        <NewWritingDateForm projects={[{ id: project.id, title: project.title }]} />
      </div>

      {dates.length === 0 ? (
        <p className="text-center text-ink-soft py-16">
          No writing dates for {project.title} yet.
        </p>
      ) : (
        <div className="space-y-2">
          {dates.map((d) => (
            <Link
              key={d.id}
              href={`/writing-dates/${d.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-sm">{d.note || "Writing Date"}</span>
              <span className="text-xs text-ink-soft">
                {new Date(d.scheduledFor).toLocaleString([], {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
