"use client";

import { useState } from "react";
import { createDocumentAction } from "@/lib/actions/documents";

export function NewDocumentInline({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity"
      >
        New document
      </button>
    );
  }

  return (
    <form action={createDocumentAction} className="flex items-center gap-2">
      <input type="hidden" name="projectId" value={projectId} />
      <input
        name="title"
        autoFocus
        placeholder="Document title…"
        className="text-sm border border-line rounded-full px-3.5 py-1.5 outline-none focus:border-ink"
      />
      <button type="submit" className="text-xs rounded-full bg-ink text-paper px-3.5 py-2">
        Create
      </button>
    </form>
  );
}
