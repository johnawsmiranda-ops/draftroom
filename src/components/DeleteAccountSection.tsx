"use client";

import { useState, useTransition } from "react";
import { requestAccountDeletionAction } from "@/lib/actions/account-deletion";

export function DeleteAccountSection({ initiallyPending }: { initiallyPending: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(initiallyPending);
  const [isSubmitting, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      await requestAccountDeletionAction();
      setPending(true);
      setConfirming(false);
    });
  }

  if (pending) {
    return (
      <div className="rounded-2xl border border-line bg-card p-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">Danger zone</h2>
        <p className="text-sm text-ink">Your deletion request is in.</p>
        <p className="text-sm text-ink-soft mt-1">
          We review these by hand right now, so it isn&apos;t instant — we&apos;ll take care of it and
          your account and everything in it will be permanently removed. If you change your mind, just
          email{" "}
          <a href="mailto:support@mindcrossed.com" className="text-accent underline decoration-dotted">
            support@mindcrossed.com
          </a>{" "}
          before it&apos;s processed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/30 bg-card p-6">
      <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">Danger zone</h2>
      {!confirming ? (
        <>
          <p className="text-sm text-ink-soft mb-4">
            Permanently delete your account and everything in it — every project, glimpse, and
            document.
          </p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-sm text-accent hover:opacity-80 transition-opacity"
          >
            Request account deletion
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-ink mb-4">
            This can&apos;t be undone once it&apos;s processed. We&apos;ll delete your account and every
            project, glimpse, and document in it. Are you sure?
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              className="rounded-full bg-accent text-paper px-5 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Yes, request deletion"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-sm text-ink-soft hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
