import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { LogoutButton } from "@/components/LogoutButton";

/**
 * The admin area deliberately sits outside the (app) route group: it gets no
 * writer sidebar, no project list, no view-mode toggle. It's a separate room
 * for account administration, not part of the writing experience.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <header className="border-b border-line bg-room text-paper/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-base tracking-wide">DRAFTROOM</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-room-line">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-room-line truncate hidden sm:inline">{admin.email}</span>
            <Link href="/home" className="text-room-line hover:text-paper transition-colors">
              ← Back to writing
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-4 text-[11px] text-ink-soft">
          Account administration only — no one&apos;s writing is readable from here.
        </div>
      </footer>
    </div>
  );
}
