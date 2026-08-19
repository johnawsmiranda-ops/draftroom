"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateNameAction } from "@/lib/actions/profile";

export function NameEditForm({ initialName }: { initialName?: string | null }) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    startTransition(() => {
      updateNameAction(fd).then((res) => {
        if (res && !res.ok) {
          setError(res.error ?? "Something went wrong.");
        } else {
          setSaved(true);
          router.refresh();
        }
      });
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSaved(false);
        }}
        placeholder="Your name"
        className="text-sm bg-transparent border border-line rounded-lg px-3 py-2 outline-none focus:border-ink"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
        className="text-xs rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Save
      </button>
      {saved && !error && <span className="text-xs text-ink-soft">Saved</span>}
      {error && <span className="text-xs text-accent">{error}</span>}
    </form>
  );
}
