import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { NewProjectInline } from "@/components/NewProjectInline";
import { SidebarProjectRow } from "@/components/DeletableProjectLink";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { Avatar } from "@/components/Avatar";

type Project = { id: string; title: string };

export function Sidebar({
  userName,
  avatarUrl,
  projects,
}: {
  userName?: string | null;
  avatarUrl?: string | null;
  projects: Project[];
}) {
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
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Profile
        </Link>
      </nav>

      <div className="mt-8 px-6 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.15em] text-room-line">Projects</span>
      </div>
      <div className="px-3 mt-2 space-y-0.5 text-sm overflow-y-auto flex-1">
        {projects.map((p) => (
          <SidebarProjectRow key={p.id} id={p.id} title={p.title} />
        ))}
        <div className="px-1 pt-1">
          <NewProjectInline />
        </div>
      </div>

      <div className="px-6 py-3 border-t border-room-line/60">
        <ViewModeToggle variant="sidebar" />
      </div>
      <div className="px-6 py-5 border-t border-room-line/60 flex items-center justify-between gap-2">
        <Link href="/profile" className="flex items-center gap-2 min-w-0 group">
          <Avatar name={userName} avatarUrl={avatarUrl} size={26} dark />
          <span className="text-xs text-room-line truncate group-hover:text-paper transition-colors">
            {userName ?? "Writer"}
          </span>
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
