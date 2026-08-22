"use client";

import { useEffect, useState } from "react";
import { GlimpseComposer } from "@/components/GlimpseComposer";
import { GlimpseWall } from "@/components/GlimpseWall";
import { GlimpseTimeline } from "@/components/GlimpseTimeline";
import { useViewMode } from "@/lib/view-mode";

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
  const { mode } = useViewMode();
  const [view, setView] = useState<"wall" | "timeline">("wall");
  const [userChose, setUserChose] = useState(false);

  // The free-drag Wall is awkward on touch, so default to Timeline on
  // mobile — but don't fight a view the person already picked themselves.
  useEffect(() => {
    if (!userChose) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView(mode === "mobile" ? "timeline" : "wall");
    }
  }, [mode, userChose]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1 bg-paper-deep rounded-full p-1">
          <button
            onClick={() => {
              setView("wall");
              setUserChose(true);
            }}
            aria-pressed={view === "wall"}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
              view === "wall"
                ? "bg-card shadow-md text-ink font-semibold"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            Wall
          </button>
          <button
            onClick={() => {
              setView("timeline");
              setUserChose(true);
            }}
            aria-pressed={view === "timeline"}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
              view === "timeline"
                ? "bg-card shadow-md text-ink font-semibold"
                : "text-ink-soft hover:text-ink"
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
