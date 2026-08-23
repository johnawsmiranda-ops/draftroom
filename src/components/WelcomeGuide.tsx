"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "draftroom.welcomeSeen";

/**
 * First-visit welcome modal + a permanent "Need help?" link that reopens it.
 * The "seen" flag lives in localStorage (same pattern as the Draftsman
 * assistant's position) rather than the database — this is a per-browser
 * nicety, not account state worth a schema change.
 */
export function WelcomeGuide({ firstName }: { firstName?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // Private browsing / storage blocked — just don't auto-open.
    }
    // One-time client-only check for a first-visit flag; safe to skip in the deps array.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!seen) setOpen(true);
  }, []);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore — worst case the modal reappears next visit.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-ink-soft underline decoration-dotted underline-offset-2 hover:text-ink transition-colors"
      >
        Need help?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4 py-8"
          onClick={close}
        >
          <div
            className="bg-card border border-line rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 sm:p-10 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">Getting started</p>
            <h2 className="font-display text-2xl mb-6">
              {firstName ? `Welcome to your room, ${firstName}.` : "Welcome to your room."}
            </h2>

            <div className="space-y-4 mb-8">
              <GuideItem title="Write" body="Open a project and work on your manuscript, chapter by chapter." />
              <GuideItem
                title="Glimpse"
                body="Capture a fragment — a line, a scene, a thought — without committing to a full draft yet."
              />
              <GuideItem title="Writing Dates" body="Come back to a project on a schedule you set for yourself." />
              <GuideItem
                title="+ New project"
                body="Start something new any time — a novel, a sermon, a poem, whatever you're working on."
              />
            </div>

            <div className="border-t border-line pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-3">A note from the developer</p>
              <div className="text-sm text-ink-soft leading-relaxed space-y-3">
                <p>
                  Hi — I&apos;m John. I built Draftroom because I kept losing good lines to moments
                  that didn&apos;t have anywhere to land. This is still early, and you&apos;re one of
                  the first people using it.
                </p>
                <p>
                  Nothing here writes for you — everything you put down stays yours. If something
                  breaks, feels confusing, or you just want to tell me what you&apos;d want next,
                  I&apos;d genuinely like to hear it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="mt-8 w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity"
            >
              Got it — let&apos;s write
            </button>
            <p className="text-center text-[11px] text-ink-soft mt-3">
              You can reopen this any time from &quot;Need help?&quot; on this page.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function GuideItem({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="font-display text-base">{title}</p>
      <p className="text-sm text-ink-soft leading-snug">{body}</p>
    </div>
  );
}
