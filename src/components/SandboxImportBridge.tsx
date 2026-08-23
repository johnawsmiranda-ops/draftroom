"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { importSandboxDraftAction } from "@/lib/actions/sandbox";

const DRAFT_KEY = "draftroom.sandboxDraft";

type Draft = { title: string; content: string; updatedAt: number };

/**
 * Mounted inside the authenticated app shell. On first render after
 * sign-in it checks for a leftover sandbox draft (written by
 * SandboxEditor while the visitor was signed out at /try) and, if one
 * exists with real content, turns it into the user's first real project
 * via importSandboxDraftAction, then clears the draft and routes them
 * straight to it. Fulfills "carry it into their new account" — nothing
 * happens if there's no draft, so this is a no-op for every normal login.
 */
export function SandboxImportBridge() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let draft: Draft | null = null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw) as Draft;
    } catch {
      draft = null;
    }

    if (!draft || !draft.content?.trim()) return;

    (async () => {
      const result = await importSandboxDraftAction(draft.title ?? "", draft.content ?? "");
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Not fatal — worst case the draft just sits there unused now.
      }
      if (result.ok) {
        router.replace(`/projects/${result.projectId}/write/${result.documentId}?chapter=${result.chapterId}`);
      }
    })();
  }, [router]);

  return null;
}
