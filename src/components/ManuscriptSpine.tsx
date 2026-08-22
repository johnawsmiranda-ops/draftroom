"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createChapterAction,
  deleteChapterAction,
  reorderChaptersAction,
  updateChapterTitleAction,
  updateDocumentTitleAction,
} from "@/lib/actions/documents";

type Chapter = { id: string; title: string; wordCount: number };

function DragHandle() {
  return (
    <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" className="text-ink-soft/50 shrink-0">
      <circle cx="3" cy="3" r="1.4" />
      <circle cx="9" cy="3" r="1.4" />
      <circle cx="3" cy="9" r="1.4" />
      <circle cx="9" cy="9" r="1.4" />
      <circle cx="3" cy="15" r="1.4" />
      <circle cx="9" cy="15" r="1.4" />
    </svg>
  );
}

function EditableTitle({
  value,
  onSave,
  className,
}: {
  value: string;
  onSave: (next: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        onClick={(e) => e.preventDefault()}
        className={`bg-transparent outline-none border-b border-ink/30 focus:border-ink ${className}`}
      />
    );
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraft(value);
        setEditing(true);
      }}
      title="Click to rename"
      className={`cursor-text hover:opacity-70 transition-opacity ${className}`}
    >
      {value}
    </span>
  );
}

export function ManuscriptSpine({
  projectId,
  document: doc,
}: {
  projectId: string;
  document: { id: string; title: string; chapters: Chapter[] };
}) {
  const router = useRouter();
  const [chapters, setChapters] = useState(doc.chapters);
  const [, startTransition] = useTransition();
  const dragIndex = useRef<number | null>(null);
  // Only true while the grip handle is held. Making the whole row draggable
  // stops clicks and focus from reaching the rename input inside it, so the
  // row opts into dragging just for the duration of a grip press.
  const [dragEnabled, setDragEnabled] = useState(false);

  function persistOrder(next: Chapter[]) {
    setChapters(next);
    startTransition(() => {
      reorderChaptersAction(
        doc.id,
        next.map((c) => c.id),
      );
    });
  }

  function onDrop(targetIndex: number) {
    if (dragIndex.current === null || dragIndex.current === targetIndex) return;
    const next = [...chapters];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(targetIndex, 0, moved);
    dragIndex.current = null;
    persistOrder(next);
  }

  async function addChapter() {
    const id = await createChapterAction(doc.id, projectId);
    if (id) router.refresh();
  }

  function renameChapter(chapterId: string, title: string) {
    setChapters((cs) => cs.map((c) => (c.id === chapterId ? { ...c, title } : c)));
    startTransition(() => {
      updateChapterTitleAction(chapterId, doc.id, title);
    });
  }

  function renameDocument(title: string) {
    startTransition(() => {
      updateDocumentTitleAction(doc.id, title).then(() => router.refresh());
    });
  }

  function removeChapter(chapterId: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setChapters((cs) => cs.filter((c) => c.id !== chapterId));
    startTransition(() => {
      deleteChapterAction(chapterId, doc.id);
    });
  }

  return (
    <div className="px-4 sm:px-10 py-10 max-w-2xl mx-auto">
      <Link href={`/projects/${projectId}/write`} className="text-xs text-ink-soft hover:text-ink">
        ← All documents
      </Link>

      <div className="mt-3 mb-8">
        <EditableTitle
          value={doc.title}
          onSave={renameDocument}
          className="font-display text-3xl block"
        />
        <p className="text-xs text-ink-soft mt-2 uppercase tracking-[0.15em]">Table of Contents</p>
      </div>

      <div className="space-y-1.5">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            draggable={dragEnabled}
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragEnd={() => setDragEnabled(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              onDrop(index);
              setDragEnabled(false);
            }}
            className="group flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 hover:-translate-y-0.5 transition-transform"
          >
            <span
              onPointerDown={() => setDragEnabled(true)}
              onPointerUp={() => setDragEnabled(false)}
              className="cursor-grab active:cursor-grabbing touch-none"
              title="Drag to reorder"
            >
              <DragHandle />
            </span>
            <span className="text-xs text-ink-soft w-5 shrink-0">{index + 1}.</span>
            <div className="flex-1 min-w-0">
              <EditableTitle
                value={chapter.title}
                onSave={(t) => renameChapter(chapter.id, t)}
                className="font-display text-base block truncate"
              />
            </div>
            <span className="text-xs text-ink-soft shrink-0">{chapter.wordCount.toLocaleString()} words</span>
            <Link
              href={`/projects/${projectId}/write/${doc.id}?chapter=${chapter.id}`}
              className="text-xs rounded-full border border-line px-3 py-1.5 text-ink-soft hover:border-ink hover:text-ink transition-colors shrink-0"
            >
              Open
            </Link>
            <button
              onClick={() => removeChapter(chapter.id, chapter.title)}
              title="Delete chapter"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-soft hover:text-accent shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0h10l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addChapter}
        className="mt-4 text-xs rounded-full border border-line px-4 py-2 text-ink-soft hover:border-ink hover:text-ink transition-colors"
      >
        + New chapter
      </button>
    </div>
  );
}
