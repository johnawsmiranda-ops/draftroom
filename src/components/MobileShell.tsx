"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ViewModeToggle } from "@/components/ViewModeToggle";

type Project = { id: string; title: string };

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function GlimpseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0012 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function WriteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 20l1-4 12-12 3 3-12 12-4 1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function DateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function MobileShell({
  userName,
  projects,
  children,
}: {
  userName?: string | null;
  projects: Project[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const firstProjectId = projects[0]?.id;

  const tabs = [
    { href: "/home", label: "Home", Icon: HomeIcon, match: (p: string) => p === "/home" },
    {
      href: firstProjectId ? `/projects/${firstProjectId}/glimpses` : "/home",
      label: "Glimpse",
      Icon: GlimpseIcon,
      match: (p: string) => p.includes("/glimpses"),
    },
    {
      href: firstProjectId ? `/projects/${firstProjectId}/write` : "/home",
      label: "Write",
      Icon: WriteIcon,
      match: (p: string) => p.includes("/write"),
    },
    { href: "/writing-dates", label: "Dates", Icon: DateIcon, match: (p: string) => p.includes("writing-dates") },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex items-center justify-between px-4 py-3 border-b border-line bg-paper sticky top-0 z-30">
        <Link href="/home" className="font-display text-base tracking-wide">
          DRAFTROOM
        </Link>
        <div className="flex items-center gap-3">
          <ViewModeToggle variant="mobile" />
          <LogoutButton />
        </div>
      </header>

      <div className="flex-1 pb-20">{children}</div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-line flex items-stretch">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname ?? "");
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] ${
                active ? "text-accent" : "text-ink-soft"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
