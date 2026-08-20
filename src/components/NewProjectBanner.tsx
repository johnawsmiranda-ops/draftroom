"use client";

import { NewProjectModal } from "@/components/NewProjectModal";

export function NewProjectBanner() {
  return (
    <div className="rounded-2xl border border-accent/30 bg-sticky-cream/60 px-6 py-5 mb-10 flex items-center justify-between gap-4 flex-col sm:flex-row text-center sm:text-left">
      <div>
        <p className="font-display text-lg mb-1">This is an empty room, for now.</p>
        <p className="text-sm text-ink-soft">
          Start a project to begin — a novel, a sermon, a poem, whatever you&apos;re working on.
        </p>
      </div>
      <NewProjectModal
        trigger={(open) => (
          <button
            onClick={open}
            className="shrink-0 rounded-full bg-accent text-paper px-6 py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            Create your first project
          </button>
        )}
      />
    </div>
  );
}
