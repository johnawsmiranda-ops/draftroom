"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteDocumentAction } from "@/lib/actions/documents";

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

export function DocumentCard({
  id,
  projectId,
  title,
  chapterCount,
  words,
}: {
  id: string;
  projectId: string;
  title: string;
  chapterCount: number;
  words: number;
}) {
  const [pending, startTransition] = useTransition();
  const [hover, setHover] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This removes all its chapters — this can't be undone.`)) return;
    startTransition(() => {
      deleteDocumentAction(id, projectId);
    });
  }

  return (
    <Link
      href={`/projects/${projectId}/write/${id}`}
      className="relative flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 hover:-translate-y-0.5 transition-transform"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pr-8">
        <p className="font-display text-lg">{title}</p>
        <p className="text-xs text-ink-soft mt-0.5">
          {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-ink-soft">{words} words</span>
        <button
          onClick={handleDelete}
          disabled={pending}
          title="Delete document"
          className={`text-ink-soft hover:text-accent transition-opacity disabled:opacity-40 ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          <TrashIcon />
        </button>
      </div>
    </Link>
  );
}
