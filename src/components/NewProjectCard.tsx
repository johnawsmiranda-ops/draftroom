"use client";

import { useState } from "react";
import { createProjectAction } from "@/lib/actions/projects";

export function NewProjectCard() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl border border-dashed border-line p-5 text-left text-ink-soft hover:text-ink hover:border-ink transition-colors"
      >
        <p className="font-display text-lg mb-1">+ New project</p>
        <p className="text-xs">Start a new room.</p>
      </button>
    );
  }

  return (
    <form
      action={createProjectAction}
      className="rounded-2xl border border-line bg-card p-5 space-y-2"
    >
      <input
        name="title"
        autoFocus
        placeholder="Project name…"
        className="w-full text-sm outline-none border-b border-line pb-1.5 bg-transparent"
      />
      <button type="submit" className="text-xs rounded-full bg-ink text-paper px-3 py-1.5">
        Create
      </button>
    </form>
  );
}
