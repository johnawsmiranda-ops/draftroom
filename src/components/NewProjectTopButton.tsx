"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

export function NewProjectTopButton() {
  return (
    <div className="relative group inline-flex">
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
      <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md bg-ink text-paper text-[11px] px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md z-10">
        Start a novel, sermon, poem — anything
      </span>
    </div>
  );
}
