"use client";

import { useState, useTransition } from "react";
import { WRITING_FORMATS, WritingFormatKey } from "@/lib/writing-formats";
import { updateWritingFormatAction } from "@/lib/actions/documents";

const PREVIEW_LINES = [
  "The start of something",
  "Every story begins with a single thought.",
  "It may arrive quietly, like a whisper.",
  "Or all at once, like a storm.",
  "Either way, it matters.",
  "This is where it begins.",
];

export function WritingFormatPicker({
  documentId,
  current,
  onClose,
  onApplied,
}: {
  documentId: string;
  current: WritingFormatKey;
  onClose: () => void;
  onApplied: (format: WritingFormatKey) => void;
}) {
  const [selected, setSelected] = useState<WritingFormatKey>(current);
  const [pending, startTransition] = useTransition();

  function choose(key: WritingFormatKey) {
    setSelected(key);
    onApplied(key);
    startTransition(() => {
      updateWritingFormatAction(documentId, key);
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-room text-paper p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">Choose Your Writing Format</h2>
            <p className="text-sm text-paper/60 mt-1">Pick the canvas that fits your mood and your words.</p>
          </div>
          <button onClick={onClose} className="text-paper/50 hover:text-paper text-sm">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {WRITING_FORMATS.map((format) => {
            const active = selected === format.key;
            return (
              <button
                key={format.key}
                onClick={() => choose(format.key)}
                disabled={pending}
                aria-pressed={active}
                className={`text-left rounded-2xl border-2 overflow-hidden transition-all ${
                  active
                    ? "border-accent shadow-xl -translate-y-1"
                    : "border-room-line/60 hover:border-room-line"
                }`}
              >
                <div
                  className="p-4 h-40 sm:h-48 overflow-hidden text-[11px] leading-relaxed"
                  style={{
                    backgroundColor: format.bg,
                    backgroundImage: format.backgroundImage,
                    color: format.text,
                  }}
                >
                  <p className="font-display text-sm mb-1.5">{PREVIEW_LINES[0]}</p>
                  {PREVIEW_LINES.slice(1).map((line) => (
                    <p key={line} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="bg-room px-3 py-3 flex items-start gap-2">
                  <span
                    className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      active ? "border-accent" : "border-paper/30"
                    }`}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </span>
                  <div>
                    <p className={`text-xs ${active ? "font-semibold text-paper" : "font-medium"}`}>
                      {format.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${active ? "text-paper/70" : "text-paper/50"}`}>
                      {format.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-paper/60">
            Tip: You can change the format anytime in Writing Mode.
          </p>
          <button
            className="text-xs rounded-full border border-paper/20 px-3 py-1.5 text-paper/50 cursor-not-allowed"
            title="More writing formats — coming soon"
            disabled
          >
            More Options
          </button>
        </div>
      </div>
    </div>
  );
}
