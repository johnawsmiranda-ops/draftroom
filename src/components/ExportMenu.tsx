"use client";

import { useEffect, useRef, useState } from "react";

export function ExportMenu({ documentId, dark }: { documentId: string; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          dark
            ? "border-paper/30 text-paper hover:bg-white/10"
            : "border-line text-ink-soft hover:border-ink hover:text-ink"
        }`}
      >
        Export
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-line bg-card shadow-lg overflow-hidden z-10 text-ink">
          <a
            href={`/api/export/${documentId}?format=pdf`}
            download
            className="block px-4 py-2.5 text-sm hover:bg-paper-deep transition-colors"
            onClick={() => setOpen(false)}
          >
            Export as PDF
          </a>
          <a
            href={`/api/export/${documentId}?format=docx`}
            download
            className="block px-4 py-2.5 text-sm hover:bg-paper-deep transition-colors border-t border-line"
            onClick={() => setOpen(false)}
          >
            Export as Word
          </a>
        </div>
      )}
    </div>
  );
}
