"use client";

import { useState } from "react";
import { deleteProjectAction } from "@/lib/actions/projects";

export function ProjectMenu({ projectId, title }: { projectId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  function handleDelete() {
    const confirmed = confirm(
      `Delete "${title}"? This removes every glimpse, document, and writing date in it — there's no undoing this.`,
    );
    if (!confirmed) return;
    setPending(true);
    deleteProjectAction(projectId);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-ink-soft hover:text-ink text-lg leading-none px-2 py-1 rounded-full hover:bg-paper-deep transition-colors"
        title="Project options"
      >
        ⋯
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 rounded-xl border border-line bg-card shadow-lg z-20 py-1">
            <button
              onClick={handleDelete}
              disabled={pending}
              className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-paper-deep transition-colors disabled:opacity-50"
            >
              {pending ? "Deleting…" : "Delete project"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
