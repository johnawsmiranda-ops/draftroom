"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "draftroom.assistantPosition";
// Matches the exported artwork's aspect ratio (320x540) so the overlaid
// eye positions below stay lined up with the actual eyes in the image.
const AVATAR_WIDTH = 84;
const AVATAR_HEIGHT = 142;
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
  "Just so you know — I'm not an AI. I can't write a word of this for you. I'm just here to cheer you on.",
  "No generating, no suggestions, no autocomplete. Just me, rooting for you from the corner of the screen.",
  "I don't have opinions on your plot. I just think it's great that you're working on it.",
  "Whatever you wrote today — it's real, it's yours, and that's worth celebrating.",
  "I can't help with the words. I can just say: you showed up, and that matters.",
];

type Point = { x: number; y: number };

export function DraftsmanAssistant({ userName }: { userName?: string | null }) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Point | null>(null);
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Every so often the whole figure does a little "gesture" wiggle — the
  // closest we can get to a hand-wave from a single flat piece of art
  // without separate hand/pose sprites.
  const [isGesturing, setIsGesturing] = useState(false);
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
        x: window.innerWidth - AVATAR_WIDTH - MARGIN,
        y: window.innerHeight - AVATAR_HEIGHT - MARGIN,
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

  // Once a minute, play a brief "doing something" gesture animation.
  useEffect(() => {
    const id = window.setInterval(() => {
      setIsGesturing(true);
      window.setTimeout(() => setIsGesturing(false), 1400);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  function clampToViewport(p: Point): Point {
    const maxX = window.innerWidth - AVATAR_WIDTH - 4;
    const maxY = window.innerHeight - AVATAR_HEIGHT - 4;
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
    setIsDragging(true);
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
    setIsDragging(false);
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

  let motionClass = "animate-draftsman-bob";
  if (isDragging) motionClass = "";
  else if (isGesturing) motionClass = "animate-draftsman-gesture";

  return (
    <div
      className="fixed z-[70] select-none"
      style={{ left: position.x, top: position.y, width: AVATAR_WIDTH, height: AVATAR_HEIGHT }}
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
        className="relative w-full h-full flex items-end justify-center cursor-grab active:cursor-grabbing touch-none bg-transparent"
        title="Draftsman — drag me, or click for a nudge"
      >
        <div className={`relative ${motionClass}`} style={{ width: AVATAR_WIDTH, height: AVATAR_HEIGHT }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/draftsman.png"
            alt="Draftsman"
            width={AVATAR_WIDTH}
            height={AVATAR_HEIGHT}
            draggable={false}
            className="w-full h-full object-contain drop-shadow-md pointer-events-none select-none"
          />
          {/* Two small skin-toned ellipses parked over the eyes, hidden by
              default and flashed briefly by the blink keyframes below —
              faked from the flat artwork rather than a real eyelid layer. */}
          <span
            className="animate-draftsman-blink absolute rounded-full bg-[#f7e1c2]"
            style={{ width: 13, height: 9, left: 26, top: 54 }}
          />
          <span
            className="animate-draftsman-blink absolute rounded-full bg-[#f7e1c2]"
            style={{ width: 13, height: 9, left: 55, top: 54 }}
          />
        </div>
      </button>
    </div>
  );
}
