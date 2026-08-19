"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  const tabs = [
    { label: "Manuscript", href: `/projects/${projectId}/write` },
    { label: "Glimpses", href: `/projects/${projectId}/glimpses` },
    { label: "Writing Dates", href: `/projects/${projectId}/writing-dates` },
  ];

  return (
    <div className="px-4 sm:px-10 border-b border-line flex gap-6 text-sm">
      {tabs.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-3 border-b-2 transition-colors ${
              active ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
