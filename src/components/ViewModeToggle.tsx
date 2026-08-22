"use client";

import { useViewMode } from "@/lib/view-mode";

export function ViewModeToggle({ variant }: { variant: "sidebar" | "mobile" }) {
  const { mode, setMode } = useViewMode();
  const next = mode === "mobile" ? "desktop" : "mobile";

  if (variant === "sidebar") {
    return (
      <button
        onClick={() => setMode(next)}
        className="text-xs text-room-line hover:text-paper transition-colors"
      >
        Switch to {next} view
      </button>
    );
  }

  // The mobile header is tight, so the full phrase wraps to two lines on
  // narrow screens rather than being truncated — "Switch to" makes it read as
  // an action instead of a label for the current state.
  return (
    <button
      onClick={() => setMode(next)}
      className="text-xs text-ink-soft hover:text-ink transition-colors underline underline-offset-2 text-right leading-tight"
    >
      Switch to {next} view
    </button>
  );
}
