"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useViewMode } from "@/lib/view-mode";

const STORAGE_KEY = "draftroom.assistantPosition";
// Matches the exported artwork's aspect ratio (320x540).
const AVATAR_WIDTH = 84;
const AVATAR_HEIGHT = 142;
const MINI_WIDTH = 122;
const MINI_HEIGHT = 40;
const MARGIN = 20;
// Height of the fixed bottom tab bar in mobile view. On a fresh load he's
// placed so his feet rest on top of it rather than floating over it — on
// desktop the same idea, with the bottom of the window as the floor.
const MOBILE_TAB_BAR = 64;
const FLOOR_GAP = 4;
// Auto-collapse to the small pill after this long with no interaction.
const IDLE_MS = 5 * 60 * 1000;
const IDLE_CHECK_MS = 15_000;

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

// A different little animation each time you click him...
const CLICK_REACTIONS = [
  "animate-draftsman-bounce",
  "animate-draftsman-wiggle",
  "animate-draftsman-nod",
  "animate-draftsman-pop",
];
// ...and a different one when you drop him after dragging.
const DRAG_REACTIONS = ["animate-draftsman-shake", "animate-draftsman-pop", "animate-draftsman-nod"];
const REACTION_DURATION = 850;

type Point = { x: number; y: number };

export function DraftsmanAssistant({ userName }: { userName?: string | null }) {
  const { mode } = useViewMode();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Point | null>(null);
  // Until he's actually dragged he is pinned by CSS to the bottom-right
  // rather than positioned from measured coordinates. On iOS `innerHeight`
  // reports the layout viewport (it ignores the collapsing URL bar and the
  // home indicator), so computing a top offset from it drops him into the
  // middle of the screen on an iPhone. `bottom` + safe-area insets are
  // resolved by the browser against the *visible* area, which is correct
  // everywhere without any measuring.
  const [anchored, setAnchored] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // Manually hidden (hide button) or auto-collapsed after 5 idle minutes —
  // either way he shrinks down to a small "Draftsman" pill you can click
  // to bring him back, rather than disappearing outright.
  const [minimized, setMinimized] = useState(false);
  // The one-off animation currently playing in reaction to a click or a
  // drag-drop, if any — takes priority over the idle bob while it runs.
  const [reactionClass, setReactionClass] = useState<string | null>(null);
  const lastReaction = useRef<string | null>(null);
  const reactionTimeout = useRef<number | null>(null);
  const lastActivity = useRef<number>(Date.now());
  const dragState = useRef<{
    dragging: boolean;
    moved: boolean;
    offsetX: number;
    offsetY: number;
  }>({ dragging: false, moved: false, offsetX: 0, offsetY: 0 });

  const size = minimized ? { w: MINI_WIDTH, h: MINI_HEIGHT } : { w: AVATAR_WIDTH, h: AVATAR_HEIGHT };
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    // One-time sync from localStorage/window size, unavailable during
    // server render — same pattern used in view-mode.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Point;
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPosition(clampToViewport(parsed));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAnchored(false);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    function onResize() {
      setPosition((p) => (p ? clampToViewport(p) : p));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Re-clamp whenever the widget's footprint changes size (full <-> mini)
  // so switching states never leaves it hanging off the viewport edge —
  // reacting to external state (window bounds vs. current size), same
  // justification as the resize handler above.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition((p) => (p ? clampToViewport(p) : p));
  }, [minimized]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!minimized && Date.now() - lastActivity.current > IDLE_MS) {
        setMinimized(true);
        setOpen(false);
      }
    }, IDLE_CHECK_MS);
    return () => window.clearInterval(id);
  }, [minimized]);

  useEffect(() => {
    return () => {
      if (reactionTimeout.current) window.clearTimeout(reactionTimeout.current);
    };
  }, []);

  function markActive() {
    lastActivity.current = Date.now();
  }

  function clampToViewport(p: Point): Point {
    const { w, h } = sizeRef.current;
    const maxX = window.innerWidth - w - 4;
    const maxY = window.innerHeight - h - 4;
    return { x: Math.min(Math.max(p.x, 4), Math.max(maxX, 4)), y: Math.min(Math.max(p.y, 4), Math.max(maxY, 4)) };
  }

  /**
   * The CSS offsets for his default spot: lower right, feet resting on the
   * nearest horizontal edge — the top of the mobile tab bar on phones, the
   * bottom of the window on desktop. `env(safe-area-inset-bottom)` keeps him
   * clear of the iPhone home indicator.
   */
  function anchorStyle(): React.CSSProperties {
    const floorOffset = mode === "mobile" ? MOBILE_TAB_BAR : 0;
    return {
      right: MARGIN,
      bottom: `calc(${floorOffset + FLOOR_GAP}px + env(safe-area-inset-bottom, 0px))`,
    };
  }

  const savePosition = useCallback((p: Point) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
  }, []);

  function playReaction(pool: string[]) {
    // Avoid repeating the same animation twice in a row.
    const choices = pool.filter((c) => c !== lastReaction.current);
    const pick = (choices.length ? choices : pool)[Math.floor(Math.random() * (choices.length ? choices.length : pool.length))];
    lastReaction.current = pick;
    if (reactionTimeout.current) window.clearTimeout(reactionTimeout.current);
    setReactionClass(pick);
    reactionTimeout.current = window.setTimeout(() => setReactionClass(null), REACTION_DURATION);
  }

  function onPointerDown(e: React.PointerEvent) {
    // While anchored he has no measured coordinates, so take them from where
    // the browser actually painted him and switch to free positioning.
    let base = position;
    if (anchored) {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      base = { x: rect.left, y: rect.top };
      setPosition(base);
      setAnchored(false);
    }
    if (!base) return;

    (e.target as Element).setPointerCapture?.(e.pointerId);
    markActive();
    setIsDragging(true);
    dragState.current = {
      dragging: true,
      moved: false,
      offsetX: e.clientX - base.x,
      offsetY: e.clientY - base.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current.dragging) return;
    // Belt and braces alongside touch-action: none — stops the gesture from
    // also being interpreted as a page scroll on touch devices.
    if (e.cancelable) e.preventDefault();
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
    markActive();

    if (minimized) {
      if (!wasMoved) setMinimized(false);
      return;
    }
    if (wasMoved) {
      playReaction(DRAG_REACTIONS);
    } else {
      playReaction(CLICK_REACTIONS);
      setOpen((o) => !o);
      setTipIndex(0);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    markActive();
    if (minimized) {
      setMinimized(false);
    } else {
      playReaction(CLICK_REACTIONS);
      setOpen((o) => !o);
      setTipIndex(0);
    }
  }

  function nextTip() {
    markActive();
    setTipIndex((i) => (i + 1) % (TIPS.length + 1));
  }

  function hide(e: React.SyntheticEvent) {
    e.stopPropagation();
    markActive();
    setOpen(false);
    setMinimized(true);
  }

  if (!mounted) return null;
  if (!anchored && !position) return null;

  // Bubble opens toward whichever side of the screen has room. Anchored means
  // he's hard against the right edge, so it always opens leftward.
  const openLeft = anchored ? true : position!.x > window.innerWidth / 2;
  const message = tipIndex === 0 ? timeGreeting(userName) : TIPS[tipIndex - 1];

  let motionClass = "animate-draftsman-bob";
  if (isDragging) motionClass = "";
  else if (reactionClass) motionClass = reactionClass;

  return (
    <div
      ref={rootRef}
      className="fixed z-[70] select-none"
      style={{
        ...(anchored ? anchorStyle() : { left: position!.x, top: position!.y }),
        width: size.w,
        height: size.h,
      }}
    >
      {open && !minimized && (
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
                markActive();
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

      <div
        role="button"
        tabIndex={0}
        aria-label={minimized ? "Show Draftsman, your writing assistant" : "Draftsman, your writing assistant"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        // Inline so no stylesheet can win: without touch-action: none the
        // browser treats the drag as a scroll / pull-to-refresh instead of
        // sending us pointermove events.
        style={{ touchAction: "none" }}
        className="relative w-full h-full flex items-end justify-center cursor-grab active:cursor-grabbing touch-none outline-none"
        title={minimized ? "Draftsman — click to bring him back" : "Draftsman — drag me, or click for a nudge"}
      >
        {minimized ? (
          <div className="flex items-center gap-2 w-full h-full rounded-full bg-card border border-line shadow-md pl-1 pr-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/draftsman.png"
              alt=""
              width={32}
              height={32}
              draggable={false}
              className="w-8 h-8 rounded-full object-cover object-top pointer-events-none select-none shrink-0"
            />
            <span className="text-xs font-display text-ink truncate">Draftsman</span>
          </div>
        ) : (
          <div className="group/mascot relative" style={{ width: AVATAR_WIDTH, height: AVATAR_HEIGHT }}>
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
            </div>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={hide}
              title="Hide Draftsman"
              aria-label="Hide Draftsman"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-card border border-line text-ink-soft hover:text-ink hover:border-ink shadow-sm flex items-center justify-center text-[10px] leading-none opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
