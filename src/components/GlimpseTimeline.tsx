"use client";

import { useState } from "react";
import { togglePinAction, deleteGlimpseAction } from "@/lib/actions/glimpses";

type Glimpse = {
  id: string;
  projectId: string;
  type: string;
  content: string;
  pinned: boolean;
  createdAt: Date;
};

function dateLabel(date: Date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { month: "long", day: "numeric" });
}

function TimelineRow({ g }: { g: Glimpse }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(g.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="relative group">
      <span className="absolute -left-[26px] top-1.5 w-2 h-2 rounded-full bg-accent/70" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] text-ink-soft mb-1">
            {new Date(g.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            {g.type === "voice" && " · voice"}
          </p>
          <p className="font-display text-lg leading-snug whitespace-pre-wrap">{g.content}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-xs">
          <button
            onClick={() => togglePinAction(g.id, g.projectId)}
            className={g.pinned ? "text-accent" : "text-ink-soft hover:text-ink"}
          >
            📌
          </button>
          <button title={copied ? "Copied!" : "Copy"} onClick={copy} className="text-ink-soft hover:text-ink">
            {copied ? "✓" : "⧉"}
          </button>
          <button
            onClick={() => {
              if (confirm("Let this glimpse go?")) deleteGlimpseAction(g.id, g.projectId);
            }}
            className="text-ink-soft hover:text-ink"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export function GlimpseTimeline({ glimpses }: { glimpses: Glimpse[] }) {
  const groups = new Map<string, Glimpse[]>();
  for (const g of glimpses) {
    const label = dateLabel(g.createdAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(g);
  }

  if (glimpses.length === 0) {
    return (
      <div className="text-center text-ink-soft py-24">
        <p className="font-display text-xl mb-2">Nothing here yet.</p>
        <p className="text-sm">Your creative history will gather here over time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-24">
      {Array.from(groups.entries()).map(([label, items]) => (
        <div key={label}>
          <h3 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-4">{label}</h3>
          <div className="space-y-4 border-l border-line pl-5">
            {items.map((g) => (
              <TimelineRow key={g.id} g={g} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
