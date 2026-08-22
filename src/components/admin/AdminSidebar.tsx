"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { LogoutButton } from "@/components/LogoutButton";

function Icon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV = [
  { href: "/admin", label: "Dashboard", d: "M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" },
  { href: "/admin/users", label: "Users", d: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1.5-4 4.4-6 8-6s6.5 2 8 6" },
];

// Sections from the design that have no feature behind them yet. Shown so the
// shape of the panel is visible, but deliberately inert rather than linking to
// pages of invented numbers.
const SOON = [
  { label: "Gift Vouchers", d: "M4 10h16v10H4zM4 6h16v4H4zM12 6v14M12 6c-2-3-6-2-6 0M12 6c2-3 6-2 6 0" },
  { label: "Announcements", d: "M4 10v4h3l6 4V6l-6 4H4zM18 9a4 4 0 010 6" },
  { label: "Subscriptions", d: "M12 3v18M6 8h9a3 3 0 010 6H9a3 3 0 000 6h9" },
  { label: "Reports", d: "M5 20V10M12 20V4M19 20v-7" },
];

export function AdminSidebar({
  name,
  email,
  avatarUrl,
  role,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "admin" | "superadmin";
}) {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-card border-r border-line flex flex-col h-screen sticky top-0">
      <div className="px-5 pt-6 pb-5">
        <p className="font-display text-base tracking-wide">DRAFTROOM</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mt-1">Admin Panel</p>
      </div>

      <nav className="px-3 space-y-0.5 text-sm">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-paper-deep text-ink font-semibold"
                  : "text-ink-soft hover:bg-paper-deep/60 hover:text-ink"
              }`}
            >
              <Icon d={item.d} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-5">
        <p className="text-[10px] uppercase tracking-[0.15em] text-ink-soft/70">Not built yet</p>
      </div>
      <nav className="px-3 mt-2 space-y-0.5 text-sm">
        {SOON.map((item) => (
          <span
            key={item.label}
            title="No feature behind this yet"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-ink-soft/40 cursor-not-allowed"
          >
            <Icon d={item.d} />
            {item.label}
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="px-5 py-3 border-t border-line">
        <Link href="/home" className="text-xs text-ink-soft hover:text-ink transition-colors">
          ← Back to writing
        </Link>
      </div>
      <div className="px-5 py-4 border-t border-line flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={name} avatarUrl={avatarUrl} size={30} />
          <div className="min-w-0">
            <p className="text-xs truncate">{name ?? email}</p>
            <p className="text-[10px] text-ink-soft">
              {role === "superadmin" ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
