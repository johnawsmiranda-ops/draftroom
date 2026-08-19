"use client";

import { useState, useRef } from "react";
import { createProjectAction } from "@/lib/actions/projects";

export function NewProjectInline() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left px-3 py-2 rounded-lg text-room-line hover:bg-white/5 hover:text-paper transition-colors text-sm"
      >
        + New project
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={createProjectAction}
      className="px-1 py-1"
      onSubmit={() => setTimeout(() => setOpen(false), 0)}
    >
      <input
        name="title"
        autoFocus
        placeholder="Project name…"
        className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-paper placeholder:text-room-line outline-none focus:bg-white/15"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        onBlur={(e) => {
          if (!e.target.value) setOpen(false);
        }}
      />
    </form>
  );
}
