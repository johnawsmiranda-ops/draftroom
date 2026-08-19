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

  return (
    <button
      onClick={() => setMode(next)}
      className="text-xs text-ink-soft hover:text-ink transition-colors underline underline-offset-2"
    >
      {next === "desktop" ? "Desktop view" : "Mobile view"}
    </button>
  );
}
