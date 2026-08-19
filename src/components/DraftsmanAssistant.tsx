"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "draftroom.assistantPosition";
const AVATAR_SIZE = 64;
const MARGIN = 20;

function timeGreeting(name?: string | null) {
  const hour = new Date().getHours();
  const who = name ? `, ${name.split(" ")[0]}` : "";
  if (hour < 5) return `Still up${who}? Even a few words count before you sleep.`;
  if (hour < 12) return `Good morning${who}! Ready to write?`;
  if (hour < 17) return `Good afternoon${who}. How's the writing going?`;
  if (hour < 21) return `Good evening${who}. Squeezing in some words before the day ends?`;
  return `Burning the midnight oil${who}? I like the dedication.`;
}

const TIPS = [
  "How are you feeling about today's writing?",
  "Need a nudge? Jot a quick Glimpse before the idea slips away.",
  "Haven't opened your Manuscript in a while — want to pick up where you left off?",
  "Scheduling a Writing Date can help you actually show up for yourself.",
  "Remember: nothing here rewrites your words. It's all you, always.",
  "Even 50 words today still counts as showing up.",
  "Try Lights On / Lights Off if the page feels too bright — or too quiet.",
  "You can drag me anywhere out of your way, by the way.",
];

type Point = { x: number; y: number };

export function DraftsmanAssistant({ userName }: { userName?: string | null }) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Point | null>(null);
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const dragState = useRef<{
    dragging: boolean;
    moved: boolean;
    offsetX: number;
    offsetY: number;
  }>({ dragging: false, moved: false, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    // One-time sync from localStorage/window size, unavailable during
    // server render — same pattern used in view-mode.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    let initial: Point | null = null;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Point;
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          initial = clampToViewport(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
    if (!initial) {
      initial = {
        x: window.innerWidth - AVATAR_SIZE - MARGIN,
        y: window.innerHeight - AVATAR_SIZE - MARGIN,
      };
    }
    setPosition(initial);
  }, []);

  useEffect(() => {
    function onResize() {
      setPosition((p) => (p ? clampToViewport(p) : p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function clampToViewport(p: Point): Point {
    const maxX = window.innerWidth - AVATAR_SIZE - 4;
    const maxY = window.innerHeight - AVATAR_SIZE - 4;
    return { x: Math.min(Math.max(p.x, 4), Math.max(maxX, 4)), y: Math.min(Math.max(p.y, 4), Math.max(maxY, 4)) };
  }

  const savePosition = useCallback((p: Point) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    if (!position) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = {
      dragging: true,
      moved: false,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging) return;
    const next = clampToViewport({
      x: e.clientX - dragState.current.offsetX,
      y: e.clientY - dragState.current.offsetY,
    });
    dragState.current.moved = true;
    setPosition(next);
  }

  function onPointerUp() {
    if (!dragState.current.dragging) return;
    const wasMoved = dragState.current.moved;
    dragState.current.dragging = false;
    dragState.current.moved = false;
    if (position) savePosition(position);
    if (!wasMoved) {
      setOpen((o) => !o);
      setTipIndex(0);
    }
  }

  function nextTip() {
    setTipIndex((i) => (i + 1) % (TIPS.length + 1));
  }

  if (!mounted || !position) return null;

  // Bubble opens toward whichever side of the screen has room.
  const openLeft = position.x > window.innerWidth / 2;
  const message = tipIndex === 0 ? timeGreeting(userName) : TIPS[tipIndex - 1];

  return (
    <div
      className="fixed z-[70] select-none"
      style={{ left: position.x, top: position.y, width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      {open && (
        <div
          className={`absolute bottom-full mb-2 w-64 rounded-2xl border border-line bg-card text-ink shadow-lg p-4 ${
            openLeft ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-display leading-snug">{message}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="text-ink-soft hover:text-ink text-xs shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextTip();
            }}
            className="mt-3 text-[11px] text-ink-soft hover:text-ink transition-colors"
          >
            {tipIndex === 0 ? "Got a tip? →" : "Another one →"}
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label="Draftsman, your writing assistant"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="w-16 h-16 rounded-full bg-[#efe6d8] border border-room-line/40 shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center hover:shadow-lg transition-shadow touch-none"
        title="Draftsman — drag me, or click for a nudge"
      >
        <DraftsmanFace />
      </button>
    </div>
  );
}

function DraftsmanFace() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
      {/* hoodie shoulders */}
      <path d="M8 60c0-10 6-16 10-18h28c4 2 10 8 10 18" fill="#e7ddc9" />
      <path d="M8 60c0-10 6-16 10-18h28c4 2 10 8 10 18" stroke="#3a3128" strokeWidth="1.5" strokeLinejoin="round" />
      {/* hood collar */}
      <path d="M22 44c2 4 6 6 10 6s8-2 10-6" stroke="#3a3128" strokeWidth="1.5" strokeLinecap="round" />
      {/* head */}
      <circle cx="32" cy="28" r="16" fill="#f6e9d8" stroke="#3a3128" strokeWidth="1.5" />
      {/* hair */}
      <path
        d="M16 26c-1-9 6-16 16-16s17 7 16 16c-2-2-4-4-6-4 0-3-2-5-4-5-1 2-3 3-5 3-1-2-3-3-5-2 0 2-2 3-4 3-3 0-6 2-8 5z"
        fill="#3a2f26"
      />
      {/* glasses */}
      <circle cx="24" cy="29" r="6" fill="none" stroke="#3a3128" strokeWidth="1.6" />
      <circle cx="40" cy="29" r="6" fill="none" stroke="#3a3128" strokeWidth="1.6" />
      <path d="M30 29h4" stroke="#3a3128" strokeWidth="1.6" />
      {/* eyes + smile */}
      <circle cx="24" cy="29" r="1.6" fill="#3a3128" />
      <circle cx="40" cy="29" r="1.6" fill="#3a3128" />
      <path d="M28 37c2 2 6 2 8 0" stroke="#3a3128" strokeWidth="1.6" strokeLinecap="round" />
      {/* pen badge on hoodie */}
      <rect x="28" y="50" width="8" height="2.4" rx="1.2" fill="#3a3128" opacity="0.6" />
    </svg>
  );
}
