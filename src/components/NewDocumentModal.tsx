"use client";

import { useState } from "react";
import { createDocumentWithTemplateAction } from "@/lib/actions/documents";
import { TEMPLATES, TemplateKey } from "@/lib/templates";

const OPTIONS: { key: TemplateKey | ""; label: string; description: string }[] = [
  { key: "", label: "Blank Page", description: "Start from scratch." },
  ...TEMPLATES.map((t) => ({ key: t.key, label: t.label, description: t.description })),
];

export function NewDocumentModal({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [templateKey, setTemplateKey] = useState<TemplateKey | "">("");

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

  const selected = TEMPLATES.find((t) => t.key === templateKey);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
      onClick={() => setOpen(false)}
    >
      <form
        action={createDocumentWithTemplateAction}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-room text-paper p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <input type="hidden" name="projectId" value={projectId} />
        <input type="hidden" name="templateKey" value={templateKey} />

        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-display text-2xl">Create New Document</h2>
            <p className="text-sm text-paper/60 mt-1">Start something new. Give your ideas a place to grow.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-paper/50 hover:text-paper text-sm">
            ✕
          </button>
        </div>

        <div className="mt-6">
          <label className="text-xs uppercase tracking-[0.15em] text-paper/50 block mb-2">1. Document Name</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            maxLength={120}
            placeholder="Enter document title…"
            className="w-full bg-white/5 border border-room-line/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-paper/40"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs uppercase tracking-[0.15em] text-paper/50 block mb-3">
            2. Choose a Template (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {OPTIONS.map((opt) => {
              const active = templateKey === opt.key;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setTemplateKey(opt.key)}
                  className={`text-left rounded-xl border-2 p-3 transition-colors ${
                    active ? "border-accent bg-white/5" : "border-room-line/50 hover:border-room-line"
                  }`}
                >
                  <p className="text-xs font-medium">{opt.label}</p>
                  <p className="text-[11px] text-paper/50 mt-1">{opt.description}</p>
                </button>
              );
            })}
          </div>
          {selected && (
            <p className="text-[11px] text-paper/40 mt-3">
              Includes: {selected.includes.join(", ")}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm rounded-full border border-room-line/60 px-5 py-2.5 text-paper/70 hover:text-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="text-sm rounded-full bg-accent text-paper px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Create Document
          </button>
        </div>
      </form>
    </div>
  );
}
