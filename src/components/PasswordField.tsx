"use client";

import { useState } from "react";

export function PasswordField({
  name,
  label,
  placeholder,
  minLength,
}: {
  name: string;
  label: string;
  placeholder: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.12em] text-ink-soft block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
        >
          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-paper pl-9 pr-10 py-2.5 text-sm outline-none focus:border-ink transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
          tabIndex={-1}
        >
          {visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3l18 18M10.6 10.6a2.5 2.5 0 003.5 3.5M9.5 5.3A10.9 10.9 0 0112 5c5 0 9 4 10 7-.4 1.1-1.1 2.3-2.1 3.4M6.5 6.7C4.5 8 3 10 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7s-9-4-10-7z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
