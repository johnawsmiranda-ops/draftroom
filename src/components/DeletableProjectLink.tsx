"use client";

import Link, { useLinkStatus } from "next/link";
import { useState, useTransition } from "react";
import { deleteProjectAction } from "@/lib/actions/projects";

/**
 * Rendered inside a <Link>, so it can read that link's navigation state.
 * Opening a project hits the database before the next screen paints, and
 * without this the card looks completely inert for that beat — which reads
 * as "my tap didn't register" and gets people clicking again.
 */
function NavigatingOverlay({ rounded }: { rounded: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      className={`absolute inset-0 ${rounded} bg-card/85 backdrop-blur-[1px] ring-2 ring-accent pointer-events-none flex items-center justify-center gap-2.5 px-4`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/draftsman.png"
        alt=""
        width={30}
        height={51}
        className="w-[30px] h-[51px] object-contain animate-draftsman-bob shrink-0"
      />
      <span className="text-[11px] text-ink-soft leading-snug">
        Getting you back to
        <br />
        where you left off…
      </span>
    </span>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-8 0h10l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dark-theme counterpart to the card overlay — a small pulsing dot. */
function SidebarNavigatingDot() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent is-busy" />
  );
}

// Sidebar row: dark theme, trash icon fades in on hover next to the link.
export function SidebarProjectRow({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [pressed, setPressed] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This removes everything in it — glimpses, writing, writing dates.`)) {
      return;
    }
    startTransition(() => {
      deleteProjectAction(id);
    });
  }

  return (
    <div className="group/row flex items-center rounded-lg hover:bg-white/5 transition-colors">
      <Link
        href={`/projects/${id}/write`}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        className={`relative flex-1 min-w-0 px-3 py-2 truncate rounded-lg transition-colors ${
          pressed ? "bg-white/15 text-paper font-medium" : ""
        }`}
        title={title}
      >
        {title}
        <SidebarNavigatingDot />
      </Link>
      <button
        onClick={handleDelete}
        disabled={pending}
        title="Delete project"
        className="opacity-0 group-hover/row:opacity-100 [@media(hover:none)]:opacity-50 transition-opacity pr-3 p-1 text-room-line hover:text-accent disabled:opacity-40"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

// Home page "recent projects" card: light theme, trash icon in the corner.
export function ProjectCardLink({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  const [pending, startTransition] = useTransition();
  // Set on pointer-down so the card reacts on contact, before the router has
  // even been asked to navigate.
  const [pressed, setPressed] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This removes everything in it — glimpses, writing, writing dates.`)) {
      return;
    }
    startTransition(() => {
      deleteProjectAction(id);
    });
  }

  return (
    <Link
      href={`/projects/${id}/write`}
      onPointerDown={(e) => {
        // The trash button lives inside the card; don't light the card up
        // when the press was aimed at deleting it.
        if ((e.target as HTMLElement).closest("button")) return;
        setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`group/card relative rounded-2xl bg-card border p-5 transition-all ${
        pressed
          ? "border-accent ring-2 ring-accent shadow-md"
          : "border-line hover:-translate-y-0.5 hover:shadow-sm"
      }`}
    >
      <p className="font-display text-lg mb-1 truncate pr-6">{title}</p>
      <p className="text-xs text-ink-soft">{subtitle}</p>
      <NavigatingOverlay rounded="rounded-2xl" />
      {/*
        Visibility is pure CSS. Driving it from React hover state meant the
        first tap on a touch screen only fired mouseenter — revealing the bin
        instead of opening the project, so everything needed tapping twice.
        On devices with no hover the icon is simply always visible.
      */}
      <button
        onClick={handleDelete}
        disabled={pending}
        title="Delete project"
        className="absolute top-4 right-4 p-1 -m-1 text-ink-soft hover:text-accent transition-opacity disabled:opacity-40 opacity-0 group-hover/card:opacity-100 [@media(hover:none)]:opacity-60"
      >
        <TrashIcon />
      </button>
    </Link>
  );
}
