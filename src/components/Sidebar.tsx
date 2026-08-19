import Link from "next/link";
import { listProjects } from "@/lib/actions/projects";
import { LogoutButton } from "@/components/LogoutButton";
import { NewProjectInline } from "@/components/NewProjectInline";

export async function Sidebar({ userName }: { userName?: string | null }) {
  const projects = await listProjects();

  return (
    <aside className="w-60 shrink-0 bg-room text-paper/90 flex flex-col h-screen sticky top-0">
      <Link href="/home" className="font-display text-base tracking-wide px-6 pt-6 pb-8 block">
        DRAFTROOM
      </Link>

      <nav className="px-3 space-y-0.5 text-sm">
        <Link
          href="/home"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/writing-dates"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Writing Dates
        </Link>
      </nav>

      <div className="mt-8 px-6 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.15em] text-room-line">Projects</span>
      </div>
      <div className="px-3 mt-2 space-y-0.5 text-sm overflow-y-auto flex-1">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}/glimpses`}
            className="flex items-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors truncate"
            title={p.title}
          >
            {p.title}
          </Link>
        ))}
        <div className="px-1 pt-1">
          <NewProjectInline />
        </div>
      </div>

      <div className="px-6 py-5 border-t border-room-line/60 flex items-center justify-between">
        <span className="text-xs text-room-line truncate">{userName ?? "Writer"}</span>
        <LogoutButton />
      </div>
    </aside>
  );
}
