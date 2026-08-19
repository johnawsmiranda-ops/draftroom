"use client";

import { useState } from "react";
import { GlimpseComposer } from "@/components/GlimpseComposer";
import { GlimpseWall } from "@/components/GlimpseWall";
import { GlimpseTimeline } from "@/components/GlimpseTimeline";

type Glimpse = {
  id: string;
  projectId: string;
  type: string;
  content: string;
  transcript: string | null;
  pinned: boolean;
  color: string | null;
  rotation: number | null;
  positionX: number | null;
  positionY: number | null;
  createdAt: Date;
};

export function GlimpseView({ projectId, glimpses }: { projectId: string; glimpses: Glimpse[] }) {
  const [view, setView] = useState<"wall" | "timeline">("wall");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-paper-deep rounded-full p-1">
          <button
            onClick={() => setView("wall")}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-colors ${
              view === "wall" ? "bg-card shadow-sm text-ink" : "text-ink-soft"
            }`}
          >
            Wall
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-colors ${
              view === "timeline" ? "bg-card shadow-sm text-ink" : "text-ink-soft"
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-10">
        <GlimpseComposer projectId={projectId} />
      </div>

      {view === "wall" ? (
        <GlimpseWall glimpses={glimpses} />
      ) : (
        <GlimpseTimeline glimpses={glimpses} />
      )}
    </div>
  );
}
