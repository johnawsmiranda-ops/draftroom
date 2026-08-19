"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

export function NewProjectInline() {
  return (
    <NewProjectModal
      trigger={(open) => (
        <button
          onClick={open}
          className="w-full text-left px-3 py-2 rounded-lg text-room-line hover:bg-white/5 hover:text-paper transition-colors text-sm"
        >
          + New project
        </button>
      )}
    />
  );
}
