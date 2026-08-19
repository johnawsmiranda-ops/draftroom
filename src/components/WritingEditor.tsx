"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { autosaveChapterAction, createChapterAction } from "@/lib/actions/documents";
import { AtmospherePlayer } from "@/components/AtmospherePlayer";

type Chapter = {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  orderIndex: number;
};

type Doc = {
  id: string;
  title: string;
  chapters: Chapter[];
};

export function WritingEditor({
  projectId,
  document: doc,
  initialChapterId,
}: {
  projectId: string;
  document: Doc;
  initialChapterId?: string;
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(initialChapterId ?? doc.chapters[0]?.id);
  const active = doc.chapters.find((c) => c.id === activeId) ?? doc.chapters[0];

  const [lightsOff, setLightsOff] = useState(false);
  const [showChrome, setShowChrome] = useState(true);
  const [wordCount, setWordCount] = useState(active?.wordCount ?? 0);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [sessionStart] = useState(() => Date.now());
  const [elapsedMin, setElapsedMin] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setElapsedMin(Math.floor((Date.now() - sessionStart) / 60000)), 30000);
    return () => clearInterval(t);
  }, [sessionStart]);

  useEffect(() => {
    if (editorRef.current && active) {
      editorRef.current.innerHTML = active.content || "<p><br></p>";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function selectChapter(id: string) {
    setActiveId(id);
    const chapter = doc.chapters.find((c) => c.id === id);
    setWordCount(chapter?.wordCount ?? 0);
  }

  const doSave = useCallback(() => {
    if (!editorRef.current || !active) return;
    const html = editorRef.current.innerHTML;
    setSaving("saving");
    autosaveChapterAction(active.id, doc.id, html).then((res) => {
      if (res?.ok) {
        setWordCount(res.wordCount ?? 0);
        setSaving("saved");
      }
    });
  }, [active, doc.id]);

  function onInput() {
    setSaving("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(doSave, 1200);
  }

  function exec(cmd: string) {
    document.execCommand(cmd);
    editorRef.current?.focus();
    onInput();
  }

  async function addChapter() {
    const id = await createChapterAction(doc.id, projectId);
    if (id) {
      router.refresh();
      setActiveId(id);
    }
  }

  function wakeChrome() {
    setShowChrome(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowChrome(false), 2600);
  }

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function toggleLights() {
    setLightsOff((v) => {
      const next = !v;
      setShowChrome(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (next) hideTimer.current = setTimeout(() => setShowChrome(false), 2600);
      return next;
    });
  }

  const rootClasses = lightsOff
    ? "fixed inset-0 z-50 bg-room text-paper/90 flex flex-col"
    : "flex flex-col min-h-screen bg-paper";

  return (
    <div className={rootClasses} onMouseMove={lightsOff ? wakeChrome : undefined}>
      <div
        className={`flex items-center justify-between px-8 py-4 transition-opacity duration-500 ${
          lightsOff ? (showChrome ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-100"
        } ${lightsOff ? "border-b border-room-line" : "border-b border-line"}`}
      >
        <div className="flex items-center gap-3 text-sm">
          {!lightsOff && (
            <a href={`/projects/${projectId}/write`} className="text-ink-soft hover:text-ink">
              ←
            </a>
          )}
          <span className={lightsOff ? "text-paper/60" : "text-ink-soft"}>{doc.title}</span>
          <span className={lightsOff ? "text-paper/30" : "text-ink-soft/50"}>/</span>
          <select
            value={activeId}
            onChange={(e) => selectChapter(e.target.value)}
            className={`bg-transparent outline-none ${lightsOff ? "text-paper" : "text-ink"}`}
          >
            {doc.chapters.map((c) => (
              <option key={c.id} value={c.id} className="text-ink">
                {c.title}
              </option>
            ))}
          </select>
          <button
            onClick={addChapter}
            className={`text-xs ${lightsOff ? "text-paper/50 hover:text-paper" : "text-ink-soft hover:text-ink"}`}
          >
            + chapter
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs ${lightsOff ? "text-paper/50" : "text-ink-soft"}`}>
            {saving === "saving" ? "Saving…" : "Saved"}
          </span>
          <AtmospherePlayer dark={lightsOff} />
          <button
            onClick={toggleLights}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              lightsOff
                ? "border-paper/30 text-paper hover:bg-white/10"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {lightsOff ? "Lights on" : "Lights off"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={onInput}
            className={`font-display text-[19px] leading-[1.9] outline-none min-h-[60vh] ${
              lightsOff ? "text-paper/95" : "text-ink"
            }`}
          />
        </div>
      </div>

      <div
        className={`flex items-center justify-between px-8 py-3 transition-opacity duration-500 ${
          lightsOff ? (showChrome ? "opacity-100" : "opacity-0 pointer-events-none") : "opacity-100"
        } ${lightsOff ? "border-t border-room-line" : "border-t border-line"}`}
      >
        <div className="flex items-center gap-1">
          {[
            { cmd: "bold", label: "B" },
            { cmd: "italic", label: "I" },
            { cmd: "underline", label: "U" },
            { cmd: "insertUnorderedList", label: "•" },
            { cmd: "insertOrderedList", label: "1." },
          ].map((b) => (
            <button
              key={b.cmd}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(b.cmd);
              }}
              className={`w-7 h-7 rounded text-xs ${
                lightsOff ? "text-paper/70 hover:bg-white/10" : "text-ink-soft hover:bg-paper-deep"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className={`flex items-center gap-4 text-xs ${lightsOff ? "text-paper/50" : "text-ink-soft"}`}>
          <span>{elapsedMin}m this session</span>
          <span>{wordCount.toLocaleString()} words</span>
        </div>
      </div>
    </div>
  );
}
