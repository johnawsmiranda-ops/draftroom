"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteProjectAction } from "@/lib/actions/projects";

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0h10l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Sidebar row: dark theme, trash icon fades in on hover next to the link.
export function SidebarProjectRow({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This removes everything in it — glimpses, writing, writing dates.`)) {
      return;
    }
    startTransition(() => {
      deleteProjectAction(id);
    });
  }

  return (
    <div className="group/row flex items-center rounded-lg hover:bg-white/5 transition-colors">
      <Link
        href={`/projects/${id}/write`}
        className="flex-1 min-w-0 px-3 py-2 truncate"
        title={title}
      >
        {title}
      </Link>
      <button
        onClick={handleDelete}
        disabled={pending}
        title="Delete project"
        className="opacity-0 group-hover/row:opacity-100 transition-opacity pr-3 text-room-line hover:text-accent disabled:opacity-40"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// Home page "recent projects" card: light theme, trash icon in the corner.
export function ProjectCardLink({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  const [pending, startTransition] = useTransition();
  const [hover, setHover] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This removes everything in it — glimpses, writing, writing dates.`)) {
      return;
    }
    startTransition(() => {
      deleteProjectAction(id);
    });
  }

  return (
    <Link
      href={`/projects/${id}/write`}
      className="relative rounded-2xl bg-card border border-line p-5 hover:-translate-y-0.5 transition-transform"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="font-display text-lg mb-1 truncate pr-6">{title}</p>
      <p className="text-xs text-ink-soft">{subtitle}</p>
      <button
        onClick={handleDelete}
        disabled={pending}
        title="Delete project"
        className={`absolute top-4 right-4 text-ink-soft hover:text-accent transition-opacity disabled:opacity-40 ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <TrashIcon />
      </button>
    </Link>
  );
}
