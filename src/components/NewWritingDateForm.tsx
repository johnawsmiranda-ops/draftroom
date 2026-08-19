"use client";

import { createWritingDateAction } from "@/lib/actions/writing-dates";

export function NewWritingDateForm({ projects }: { projects: { id: string; title: string }[] }) {
  if (projects.length === 0) {
    return <p className="text-sm text-ink-soft">Create a project first to set a writing date.</p>;
  }

  return (
    <form action={createWritingDateAction} className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <label className="text-xs text-ink-soft block mb-1.5">Project</label>
        <select
          name="projectId"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="text-xs text-ink-soft block mb-1.5">When</label>
        <input
          type="datetime-local"
          name="scheduledFor"
          required
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs text-ink-soft block mb-1.5">Note (optional)</label>
        <input
          type="text"
          name="note"
          placeholder="Writing Date"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none"
        />
      </div>
      <button
        type="submit"
        className="text-sm rounded-full bg-ink text-paper px-5 py-2.5 hover:opacity-90 transition-opacity"
      >
        Set date
      </button>
    </form>
  );
}
