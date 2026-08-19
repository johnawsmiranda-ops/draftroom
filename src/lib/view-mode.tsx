"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ViewMode = "mobile" | "desktop";

const ViewModeContext = createContext<{
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
} | null>(null);

const STORAGE_KEY = "draftroom-view-mode";

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  // Default to desktop on the server render; correct itself right after
  // mount from a saved preference or the device's actual width, so a manual
  // choice always wins over the real screen size from then on.
  const [mode, setModeState] = useState<ViewMode>("desktop");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    // One-time sync from external systems (localStorage, window width) that
    // aren't available during server render — no way to read these without
    // an effect, so a single post-mount setState is intentional here.
    if (saved === "mobile" || saved === "desktop") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(saved);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(window.innerWidth < 768 ? "mobile" : "desktop");
    }
  }, []);

  function setMode(m: ViewMode) {
    setModeState(m);
    window.localStorage.setItem(STORAGE_KEY, m);
  }

  return <ViewModeContext.Provider value={{ mode, setMode }}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used within ViewModeProvider");
  return ctx;
}
