"use client";

import { useMemo, useRef, useState } from "react";
import { GlimpseCard } from "@/components/GlimpseCard";
import { updateGlimpsePosition } from "@/lib/actions/glimpses";

type Glimpse = {
  id: string;
  projectId: string;
  type: string;
  content: string;
  transcript: string | null;
  pinned: boolean;
  color: string | null;
  rotation: number | null;
  positionX: number | null;
  positionY: number | null;
  createdAt: Date;
};

function seededLayout(glimpses: Glimpse[]) {
  const cols = 4;
  const cellW = 280;
  const cellH = 200;
  return glimpses.map((g, i) => {
    if (g.positionX != null && g.positionY != null) {
      return { ...g, x: g.positionX, y: g.positionY };
    }
    const col = i % cols;
    const row = Math.floor(i / cols);
    const seed = (g.id.charCodeAt(0) + g.id.charCodeAt(g.id.length - 1)) % 40;
    const x = col * cellW + (seed - 20);
    const y = row * cellH + ((seed * 3) % 30);
    return { ...g, x, y };
  });
}

export function GlimpseWall({ glimpses }: { glimpses: Glimpse[] }) {
  const laidOut = useMemo(() => seededLayout(glimpses), [glimpses]);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function onPointerDown(e: React.PointerEvent, id: string, x: number, y: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragState.current = {
      id,
      offsetX: e.clientX - rect.left - x,
      offsetY: e.clientY - rect.top - y,
    };
    setDraggingId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - dragState.current.offsetX;
    const y = e.clientY - rect.top - dragState.current.offsetY;
    setPositions((p) => ({ ...p, [dragState.current!.id]: { x, y } }));
  }

  function onPointerUp() {
    if (!dragState.current) return;
    const { id } = dragState.current;
    const pos = positions[id];
    dragState.current = null;
    setDraggingId(null);
    if (pos) {
      updateGlimpsePosition(id, glimpses.find((g) => g.id === id)?.projectId ?? "", pos.x, pos.y);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-[70vh] pb-24"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {laidOut.map((g) => {
        const pos = positions[g.id] ?? { x: g.x, y: g.y };
        return (
          <div
            key={g.id}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `rotate(${g.rotation ?? 0}deg)`,
              zIndex: draggingId === g.id ? 50 : 1,
            }}
            onPointerDown={(e) => onPointerDown(e, g.id, pos.x, pos.y)}
          >
            <GlimpseCard glimpse={g} />
          </div>
        );
      })}
      {glimpses.length === 0 && (
        <div className="text-center text-ink-soft py-24">
          <p className="font-display text-xl mb-2">The wall is empty.</p>
          <p className="text-sm">Leave your first glimpse above.</p>
        </div>
      )}
    </div>
  );
}
