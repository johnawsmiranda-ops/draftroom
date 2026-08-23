"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DRAFT_KEY = "draftroom.sandboxDraft";
const SAVE_DELAY_MS = 500;

type Draft = { title: string; content: string; updatedAt: number };

function wordCount(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/**
 * The one genuinely interactive piece of the signed-out sandbox at /try.
 * Nothing here ever touches the database — it's held entirely in this
 * browser's localStorage so a curious visitor can feel out the writing
 * experience with zero commitment. If they like it and sign up,
 * importSandboxDraftAction turns whatever's here into their real first
 * project (see SandboxImportBridge, mounted inside the authenticated shell).
 */
export function SandboxEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Draft;
        // One-time client-only restore of a locally-saved draft.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(draft.title ?? "");
        setContent(draft.content ?? "");
      }
    } catch {
      // Corrupt/blocked storage — just start blank.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        const draft: Draft = { title, content, updatedAt: Date.now() };
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // Ignore — worst case this draft just isn't recoverable later.
      }
    }, SAVE_DELAY_MS);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [title, content, loaded]);

  const hasText = content.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-10 py-10">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
          Scratch document · not saved to an account
        </p>
        <Link
          href="/signup?from=sandbox"
          className="shrink-0 rounded-full bg-ink text-paper px-5 py-2 text-sm hover:opacity-90 transition-opacity"
        >
          Sign up to save this
        </Link>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full font-display text-3xl bg-transparent outline-none placeholder:text-ink-soft/50 mb-4"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing — nothing here leaves your browser until you sign up."
        rows={18}
        className="w-full bg-transparent outline-none resize-none text-ink leading-relaxed placeholder:text-ink-soft/50"
      />

      <div className="flex items-center justify-between text-xs text-ink-soft mt-4 pt-4 border-t border-line">
        <span>{wordCount(content)} words</span>
        {hasText && <span>Kept in this browser only — sign up to keep it for good.</span>}
      </div>
    </div>
  );
}
