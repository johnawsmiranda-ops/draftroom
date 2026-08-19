"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

export function NewProjectCard() {
  return (
    <NewProjectModal
      trigger={(open) => (
        <button
          onClick={open}
          className="rounded-2xl border border-dashed border-line p-5 text-left text-ink-soft hover:text-ink hover:border-ink transition-colors"
        >
          <p className="font-display text-lg mb-1">+ New project</p>
          <p className="text-xs">Start a new room.</p>
        </button>
      )}
    />
  );
}
