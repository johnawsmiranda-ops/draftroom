"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

export function NewProjectTopButton() {
  return (
    <NewProjectModal
      trigger={(open) => (
        <button
          onClick={open}
          className="shrink-0 flex items-center gap-1.5 rounded-full bg-ink text-paper px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          <span className="text-base leading-none">+</span> New project
        </button>
      )}
    />
  );
}
