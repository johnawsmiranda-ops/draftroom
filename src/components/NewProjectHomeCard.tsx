"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

const COPY = {
  write: {
    title: "Write",
    subtitle: "Start your first project.",
    className: "bg-sticky-sage/60",
    hint: "Create a project, then open it to write",
  },
  glimpse: {
    title: "Glimpse",
    subtitle: "Capture your first idea.",
    className: "bg-sticky-peach/60",
    hint: "Create a project, then capture a quick fragment",
  },
} as const;

export function NewProjectHomeCard({ kind }: { kind: "write" | "glimpse" }) {
  const copy = COPY[kind];
  return (
    <NewProjectModal
      trigger={(open) => (
        <button
          onClick={open}
          className={`group relative text-left rounded-2xl border border-line p-6 hover:-translate-y-0.5 transition-transform ${copy.className}`}
        >
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink text-paper text-[11px] px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md z-10">
            {copy.hint}
          </span>
          <p className="font-display text-xl mb-1">{copy.title}</p>
          <p className="text-sm text-ink-soft">{copy.subtitle}</p>
        </button>
      )}
    />
  );
}
