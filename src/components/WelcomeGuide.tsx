"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SEEN_KEY = "draftroom.welcomeSeen";
const LAST_VISIT_KEY = "draftroom.lastVisit";
const RETURN_THRESHOLD_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

/**
 * Welcome modal + a permanent "Need help?" link that reopens it.
 *
 * Opens automatically the very first time someone reaches Home (brand-new
 * user, greeted "Welcome to your room"), and again any time at least 5
 * days have passed since their last visit (returning user, greeted
 * "Welcome back"). Both the "has this person ever completed onboarding"
 * flag and their last-visit timestamp live in localStorage — same
 * per-browser pattern as the Draftsman assistant's saved position, not
 * account state worth a schema change.
 */
export function WelcomeGuide({ firstName }: { firstName?: string }) {
  const [open, setOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    let seen = false;
    let lastVisit: number | null = null;
    try {
      seen = Boolean(window.localStorage.getItem(SEEN_KEY));
      const raw = window.localStorage.getItem(LAST_VISIT_KEY);
      lastVisit = raw ? Number(raw) : null;
    } catch {
      // Private browsing / storage blocked — just don't auto-open.
    }

    const now = Date.now();
    const msSinceLastVisit = lastVisit ? now - lastVisit : Infinity;
    const shouldAutoOpen = !seen || msSinceLastVisit >= RETURN_THRESHOLD_MS;

    // One-time client-only check of first-visit/last-visit flags; safe to skip in the deps array.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReturning(seen);
    if (shouldAutoOpen) {
      setOpen(true);
    }

    try {
      window.localStorage.setItem(LAST_VISIT_KEY, String(now));
    } catch {
      // Ignore — worst case the 5-day return prompt just doesn't fire.
    }
  }, []);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Ignore — worst case the modal reappears next visit.
    }
  }

  const heading = isReturning
    ? firstName
      ? `Welcome back, ${firstName}.`
      : "Welcome back."
    : firstName
      ? `Welcome to your room, ${firstName}.`
      : "Welcome to your room.";

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
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">
              {isReturning ? "Welcome back" : "Getting started"}
            </p>
            <h2 className="font-display text-2xl mb-6">{heading}</h2>

            <div className="rounded-xl overflow-hidden border border-line mb-6">
              <Image
                src="/onboarding-guide.png"
                alt="Draftroom home page with Write, Glimpse, Writing Dates, and New project labeled 1 through 4"
                width={1400}
                height={335}
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-4 mb-8">
              <GuideItem
                number={1}
                title="Write"
                body="Open a project and work on your manuscript, chapter by chapter."
              />
              <GuideItem
                number={2}
                title="Glimpse"
                body="Capture a fragment — a line, a scene, a thought — without committing to a full draft yet."
              />
              <GuideItem
                number={3}
                title="Writing Dates"
                body="Come back to a project on a schedule you set for yourself."
              />
              <GuideItem
                number={4}
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
                  I&apos;d genuinely like to hear it — email me directly at{" "}
                  <a
                    href="mailto:support@mindcrossed.com"
                    className="text-accent underline decoration-dotted underline-offset-2 hover:opacity-80"
                  >
                    support@mindcrossed.com
                  </a>
                  .
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

function GuideItem({ number, title, body }: { number: number; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-accent text-paper text-xs font-semibold">
        {number}
      </span>
      <div>
        <p className="font-display text-base">{title}</p>
        <p className="text-sm text-ink-soft leading-snug">{body}</p>
      </div>
    </div>
  );
}
