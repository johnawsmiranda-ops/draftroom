"use client";

import { useMemo, useState } from "react";

type Point = { date: string; signups: number; total: number };

const W = 720;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

function niceCeil(n: number) {
  if (n <= 5) return 5;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / mag) * mag;
}

function formatDay(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/**
 * Cumulative user growth — a single series, so it carries no legend (the card
 * title names it) and gets a crosshair + tooltip rather than a label on every
 * point. Grid and axes stay recessive so the line is the only thing that reads
 * as data.
 */
export function UserGrowthChart({ data }: { data: Point[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { maxY, points, plotW, plotH } = useMemo(() => {
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const maxY = niceCeil(Math.max(1, ...data.map((d) => d.total)));
    const points = data.map((d, i) => ({
      ...d,
      x: PAD.left + (data.length === 1 ? plotW / 2 : (i / (data.length - 1)) * plotW),
      y: PAD.top + plotH - (d.total / maxY) * plotH,
    }));
    return { maxY, points, plotW, plotH };
  }, [data]);

  if (data.length === 0) {
    return <p className="text-sm text-ink-soft py-12 text-center">No signups yet.</p>;
  }

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD.top + plotH} L${points[0].x},${
    PAD.top + plotH
  } Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    value: Math.round(maxY * f),
    y: PAD.top + plotH - f * plotH,
  }));

  // Label roughly every 6th day so the axis never collides with itself.
  const xTickEvery = Math.max(1, Math.floor(data.length / 5));
  const active = hoverIndex !== null ? points[hoverIndex] : null;

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    const ratio = (relX - PAD.left) / plotW;
    const idx = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, idx)));
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Cumulative registered users over the last 30 days"
      >
        {yTicks.map((t) => (
          <g key={t.value}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={t.y}
              y2={t.y}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={t.y + 3.5}
              textAnchor="end"
              className="fill-ink-soft"
              style={{ fontSize: 10 }}
            >
              {t.value}
            </text>
          </g>
        ))}

        {points.map((p, i) =>
          i % xTickEvery === 0 || i === points.length - 1 ? (
            <text
              key={p.date}
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              className="fill-ink-soft"
              style={{ fontSize: 10 }}
            >
              {formatDay(p.date)}
            </text>
          ) : null,
        )}

        <path d={areaPath} fill="var(--accent)" opacity="0.12" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {active && (
          <>
            <line
              x1={active.x}
              x2={active.x}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--ink-soft)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* 2px surface ring keeps the marker legible over the filled area. */}
            <circle cx={active.x} cy={active.y} r="6" fill="var(--card)" />
            <circle cx={active.x} cy={active.y} r="4.5" fill="var(--accent)" />
          </>
        )}
      </svg>

      {active && (
        <div
          className="absolute pointer-events-none rounded-lg border border-line bg-card px-2.5 py-1.5 shadow-lg text-[11px] whitespace-nowrap"
          style={{
            left: `${(active.x / W) * 100}%`,
            top: 0,
            transform: "translate(-50%, -4px)",
          }}
        >
          <p className="text-ink-soft">{formatDay(active.date)}</p>
          <p className="font-semibold text-ink">{active.total.toLocaleString()} users</p>
          {active.signups > 0 && <p className="text-ink-soft">+{active.signups} that day</p>}
        </div>
      )}
    </div>
  );
}
