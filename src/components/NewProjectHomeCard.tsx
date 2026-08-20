"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

const COPY = {
  write: { title: "Write", subtitle: "Start your first project.", className: "bg-sticky-sage/60" },
  glimpse: { title: "Glimpse", subtitle: "Capture your first idea.", className: "bg-sticky-peach/60" },
} as const;

export function NewProjectHomeCard({ kind }: { kind: "write" | "glimpse" }) {
  const copy = COPY[kind];
  return (
    <NewProjectModal
      trigger={(open) => (
        <button
          onClick={open}
          className={`text-left rounded-2xl border border-line p-6 hover:-translate-y-0.5 transition-transform ${copy.className}`}
        >
          <p className="font-display text-xl mb-1">{copy.title}</p>
          <p className="text-sm text-ink-soft">{copy.subtitle}</p>
        </button>
      )}
    />
  );
}
