"use client";

import { useState } from "react";
import { togglePinAction, deleteGlimpseAction } from "@/lib/actions/glimpses";

const COLOR_MAP: Record<string, string> = {
  peach: "bg-sticky-peach",
  sage: "bg-sticky-sage",
  blush: "bg-sticky-blush",
  cream: "bg-sticky-cream",
  lav: "bg-sticky-lav",
};

type Glimpse = {
  id: string;
  projectId: string;
  type: string;
  content: string;
  transcript: string | null;
  pinned: boolean;
  color: string | null;
  rotation: number | null;
  createdAt: Date;
};

export function GlimpseCard({
  glimpse,
  dragHandleProps,
  style,
}: {
  glimpse: Glimpse;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const color = COLOR_MAP[glimpse.color ?? "cream"] ?? "bg-sticky-cream";

  const time = new Date(glimpse.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      style={style}
      className={`${color} w-64 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.08)] px-4 pt-4 pb-3 select-none group`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...dragHandleProps}
    >
      {glimpse.type === "voice" && (
        <div className="flex items-center gap-1.5 mb-2 text-[10px] text-ink-soft">
          <span>🎙</span>
          <span>voice glimpse</span>
        </div>
      )}
      <p className="font-display text-[15px] leading-snug whitespace-pre-wrap break-words">
        {glimpse.content}
      </p>
      <div className="flex items-center justify-between mt-3 text-[10px] text-ink-soft/80">
        <span>{time}</span>
        <div
          className={`flex items-center gap-2 transition-opacity ${
            hover || glimpse.pinned ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            title="Pin"
            onClick={() => togglePinAction(glimpse.id, glimpse.projectId)}
            className={glimpse.pinned ? "text-accent" : "hover:text-ink"}
          >
            📌
          </button>
          <button
            title="Delete"
            onClick={() => {
              if (confirm("Let this glimpse go?")) deleteGlimpseAction(glimpse.id, glimpse.projectId);
            }}
            className="hover:text-ink"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
