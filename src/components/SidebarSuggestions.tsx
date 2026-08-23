"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "draftroom.suggestionsDismissed";

/**
 * A small "got an idea?" callout that sits above the account row in the
 * sidebar, prompting people to email suggestions/concerns straight to
 * support. Dismissible per-browser (localStorage), same pattern as the
 * welcome guide and Draftsman position — not account state.
 */
export function SidebarSuggestions() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let stored = false;
    try {
      stored = Boolean(window.localStorage.getItem(DISMISS_KEY));
    } catch {
      // Private browsing / storage blocked — just show it.
    }
    // One-time client-only check of a dismissal flag; safe to skip in the deps array.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(stored);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore — worst case it shows again next visit.
    }
  }

  if (dismissed) return null;

  return (
    <div className="mx-3 mb-3 rounded-xl bg-card text-ink p-4 relative">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2.5 right-2.5 text-ink-soft hover:text-ink text-xs leading-none"
      >
        ✕
      </button>
      <div className="flex items-center gap-1.5 mb-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
          <path
            d="M12 21s-7.5-4.9-10-9.3C0.3 8.1 2 4.5 5.6 4c2.1-.3 4 .8 5 2.4C11.6 4.8 13.5 3.7 15.6 4c3.6.5 5.3 4.1 3.6 7.7C21 16.1 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
        <p className="font-display text-sm">Suggestions?</p>
      </div>
      <p className="text-xs text-ink-soft leading-snug mb-3">
        Have an idea or found something that could make Draftroom better? We&apos;d love to hear it.
      </p>
      <a
        href="mailto:support@mindcrossed.com"
        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:opacity-80 transition-opacity"
      >
        Send to Support <span aria-hidden>&rarr;</span>
      </a>
    </div>
  );
}
