import Link from "next/link";
import { requireUser } from "@/lib/current-user";
import { listProjects } from "@/lib/actions/projects";
import { NewProjectCard } from "@/components/NewProjectCard";
import { NewProjectModal } from "@/components/NewProjectModal";
import { ProjectCardLink } from "@/components/DeletableProjectLink";

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function HomePage() {
  const user = await requireUser();
  const projects = await listProjects();
  const firstName = (user.name ?? "").split(" ")[0];
  const hasProjects = projects.length > 0;

  return (
    <main className="px-4 sm:px-10 py-12 max-w-5xl mx-auto">
      <p className="text-sm uppercase tracking-[0.2em] text-ink-soft mb-2">
        {firstName ? `Welcome, ${firstName}` : "Welcome"}
      </p>

      <div className="flex items-start sm:items-center justify-between gap-4 mb-12 flex-col sm:flex-row">
        <h1 className="font-display text-4xl">Your creative room.</h1>
        <NewProjectModal
          trigger={(open) => (
            <button
              onClick={open}
              className="shrink-0 flex items-center gap-1.5 rounded-full bg-ink text-paper px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
            >
              <span className="text-base leading-none">+</span> New project
            </button>
          )}
        />
      </div>

      {!hasProjects && (
        <div className="rounded-2xl border border-accent/30 bg-sticky-cream/60 px-6 py-5 mb-10 flex items-center justify-between gap-4 flex-col sm:flex-row text-center sm:text-left">
          <div>
            <p className="font-display text-lg mb-1">This is an empty room, for now.</p>
            <p className="text-sm text-ink-soft">
              Start a project to begin — a novel, a sermon, a poem, whatever you&apos;re working on.
            </p>
          </div>
          <NewProjectModal
            trigger={(open) => (
              <button
                onClick={open}
                className="shrink-0 rounded-full bg-accent text-paper px-6 py-2.5 text-sm hover:opacity-90 transition-opacity"
              >
                Create your first project
              </button>
            )}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {hasProjects ? (
          <Link
            href={`/projects/${projects[0].id}/write`}
            className="rounded-2xl bg-sticky-sage/60 border border-line p-6 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-display text-xl mb-1">Write</p>
            <p className="text-sm text-ink-soft">Continue your work.</p>
          </Link>
        ) : (
          <NewProjectModal
            trigger={(open) => (
              <button
                onClick={open}
                className="text-left rounded-2xl bg-sticky-sage/60 border border-line p-6 hover:-translate-y-0.5 transition-transform"
              >
                <p className="font-display text-xl mb-1">Write</p>
                <p className="text-sm text-ink-soft">Start your first project.</p>
              </button>
            )}
          />
        )}

        {hasProjects ? (
          <Link
            href={`/projects/${projects[0].id}/glimpses`}
            className="rounded-2xl bg-sticky-peach/60 border border-line p-6 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-display text-xl mb-1">Glimpse</p>
            <p className="text-sm text-ink-soft">Leave something behind.</p>
          </Link>
        ) : (
          <NewProjectModal
            trigger={(open) => (
              <button
                onClick={open}
                className="text-left rounded-2xl bg-sticky-peach/60 border border-line p-6 hover:-translate-y-0.5 transition-transform"
              >
                <p className="font-display text-xl mb-1">Glimpse</p>
                <p className="text-sm text-ink-soft">Capture your first idea.</p>
              </button>
            )}
          />
        )}

        <Link
          href="/writing-dates"
          className="rounded-2xl bg-sticky-lav/60 border border-line p-6 hover:-translate-y-0.5 transition-transform"
        >
          <p className="font-display text-xl mb-1">Writing Dates</p>
          <p className="text-sm text-ink-soft">Come back to your work.</p>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Recent projects</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <ProjectCardLink
            key={p.id}
            id={p.id}
            title={p.title}
            subtitle={`Updated ${timeAgo(p.updatedAt)}`}
          />
        ))}
        <NewProjectCard />
      </div>
    </main>
  );
}
